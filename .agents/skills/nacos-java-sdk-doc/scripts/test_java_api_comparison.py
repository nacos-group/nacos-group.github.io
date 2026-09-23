"""Regression checks for resource inheritance and exact API comparison inputs."""
import tempfile
import unittest
from pathlib import Path

from compare_java_api_with_doc import load_java_api, method_chapter, parse_usage_signatures
from parse_java_interface import load_interface_hierarchy, parse_java_interface


class InterfaceParsingTest(unittest.TestCase):
    def test_abstract_and_default_bodies_do_not_consume_other_methods(self):
        methods = parse_java_interface('''
            /** @since 3.3.0 */
            public interface Example {
                /** First operation. */
                String first(String name) throws NacosException;
                String second(String name);
                /** Multi-line delegate. */
                @Since("3.3.1")
                default Page<AgentSummary> search(
                        Map<String, List<String>> filters,
                        int page) throws NacosException {
                    if (filters.isEmpty()) {
                        return fallback(page);
                    }
                    return query(filters, page);
                }
                /** One-line delegate. */
                default String third() { return first("test"); }
            }
        ''', 'Example')
        self.assertEqual(['first', 'second', 'search', 'third'], [m['name'] for m in methods])
        self.assertEqual(['String'], methods[0]['param_types'])
        self.assertEqual(['Map<String, List<String>>', 'int'], methods[2]['param_types'])
        self.assertEqual('Page<AgentSummary>', methods[2]['return_type'])
        self.assertEqual('3.3.1', methods[2]['since'])
        self.assertEqual('3.3.0', methods[0]['since'])
        self.assertEqual('NacosException', methods[0]['throws'])

    def test_equal_arity_overloads_and_generic_return_remain_distinct(self):
        signatures = parse_usage_signatures('''
### 11.1. Search
```java
Page<AgentSummary> searchAgents(AgentSearchRequest request) throws NacosException;
Page<AgentSummary> searchAgents(String name) throws NacosException;
```
''')
        self.assertEqual(2, len(signatures))
        self.assertEqual(('AgentSearchRequest',), signatures[0]['param_types'])
        self.assertEqual(('String',), signatures[1]['param_types'])
        self.assertEqual('Page<AgentSummary>', signatures[0]['return_type'])


class HierarchyTest(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.write('config/ConfigService.java', 'ConfigService', 'String getConfig(String key);')
        self.write('naming/NamingService.java', 'NamingService', 'void registerInstance(String name);')
        self.write('lock/LockService.java', 'LockService', 'void lock(String name);')
        self.write('ai/A2aService.java', 'A2aService', 'AgentCard getAgentCard(String name);')
        self.write('ai/AgentDiscoveryService.java', 'AgentDiscoveryService',
                   'Page<AgentSummary> searchAgents(AgentSearchRequest request);')
        self.write('ai/AgentService.java', 'AgentService',
                   'AgentVersionDetail publishAgent(AgentPublishRequest request);',
                   'A2aService, AgentDiscoveryService')
        self.write('ai/AiService.java', 'AiService', '''
            default AgentCard getAgentCard(String name) { return agent().getAgentCard(name); }
            /** Child resource entry point. */
            AgentService agent();
        ''', 'A2aService')

    def write(self, relative, name, methods, parents='', imports=''):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        extends = ' extends ' + parents if parents else ''
        path.write_text(f'{imports}\npublic interface {name}{extends} {{\n/** Operation. */\n{methods}\n}}')

    def test_resource_chapters_and_facade_deduplication(self):
        methods = load_java_api(str(self.root))
        names = [m['name'] for m in methods]
        self.assertEqual(1, names.count('getAgentCard'))
        chapters = {m['name']: m['chapter'] for m in methods}
        self.assertEqual(7, chapters['getAgentCard'])
        self.assertEqual(11, chapters['searchAgents'])
        self.assertEqual(11, chapters['publishAgent'])
        self.assertEqual(2, chapters['agent'])

    def test_parent_import_from_another_api_package(self):
        self.write('ai/AgentService.java', 'AgentService',
                   'AgentVersionDetail publishAgent(AgentPublishRequest request);', 'AgentDiscoveryService',
                   'import com.alibaba.nacos.api.discovery.AgentDiscoveryService;')
        (self.root / 'discovery').mkdir()
        (self.root / 'ai/AgentDiscoveryService.java').rename(self.root / 'discovery/AgentDiscoveryService.java')
        self.assertIn('AgentDiscoveryService', load_interface_hierarchy(self.root))

    def test_missing_parent_is_an_error(self):
        (self.root / 'ai/AgentDiscoveryService.java').unlink()
        with self.assertRaises(FileNotFoundError):
            load_interface_hierarchy(self.root)

    def test_inheritance_cycle_is_an_error(self):
        self.write('ai/A2aService.java', 'A2aService', 'AgentCard getAgentCard(String name);', 'AgentService')
        with self.assertRaisesRegex(ValueError, 'Cyclic'):
            load_interface_hierarchy(self.root)

    def test_stale_facade_delegate_is_an_error(self):
        self.write('ai/AiService.java', 'AiService', 'String getAgentCard(String name);', 'A2aService')
        with self.assertRaisesRegex(ValueError, 'no matching resource signature'):
            load_java_api(str(self.root))

    def test_unknown_resource_cannot_silently_use_wrong_chapter(self):
        with self.assertRaisesRegex(ValueError, 'No documentation chapter'):
            method_chapter({'source': 'NewService'})


if __name__ == '__main__':
    unittest.main()
