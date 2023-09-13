import React from 'react';
import siteConfig from '../../../site_config/site';
import { getLink } from '../../../utils';
import './index.scss';

class Footer extends React.Component {

  render() {
    const props = this.props;
    const language = props.language;
    const dataSource = siteConfig[language];
    return (
      <footer className="footer-container">
        <div className="footer-body">
          <img src={props.logo} />
          <div className="cols-container">
            <div className="col col-12">
              <h3>{dataSource.disclaimer.title}</h3>
              <p>{dataSource.disclaimer.content}</p>
            </div>
            <div className="col col-6">
              <dl>
                <dt>{dataSource.documentation.title}</dt>
                {
                  dataSource.documentation.list.map((d, i) => (
                    <dd key={i}><a href={getLink(d.link)} target={d.target || '_self'}>{d.text}</a></dd>
                  ))
                }
              </dl>
            </div>
            <div className="col col-6">
            <dl>
            <dt>{dataSource.resources.title}</dt>
            {
              dataSource.resources.list.map((d, i) => (
                <dd key={i}><a href={getLink(d.link)} target={d.target || '_self'}>{d.text}</a></dd>
              ))
            }
            </dl>
            </div>
          </div>
          <div className="copyright"><span>{dataSource.copyright}</span></div>
        </div>
      </footer>
    );
  }
}

export default Footer;
