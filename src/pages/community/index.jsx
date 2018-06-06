import React from 'react';
import Header from '../../components/header';
import Bar from '../../components/bar';
import Slider from '../../components/slider';
import EventCard from './eventCard';
import ContactItem from './contactItem';
import ContributorItem from './contributorItem';
import EcoItem from './ecoItem';
import Footer from '../../components/footer';
import siteConfig from '../../../site_config/site';
import communityConfig from '../../../site_config/community.jsx';

import './index.scss';

class Community extends React.Component {

  render() {
    const language = siteConfig.defaultLanguage;
    const dataSource = communityConfig[language];
    return (
      <div className="community-page">
        <Header type="normal" logo="./img/nacos_colorful.png" />
        <Bar img="./img/community.png" text={dataSource.barText} />
        <section className="events-section">
          <div className="events-body">
            <h3>{dataSource.events.title}</h3>
            <Slider>
              {dataSource.events.list.map((event, i) => (
                <EventCard event={event} key={i} />
              ))}
            </Slider>
          </div>
        </section>
        <section className="eco-section">
          <h3>{dataSource.ecos.title}</h3>
          <div className="eco-lists">
          {
            dataSource.ecos.list.map((eco, i) => (
              <EcoItem eco={eco} key={i} />
            ))
          }
          </div>
        </section>
        <section className="contact-section">
          <div className="contact-body">
            <h3>{dataSource.contacts.title}</h3>
            <p>{dataSource.contacts.desc}</p>
            <div className="contact-list">
            {
              dataSource.contacts.list.map((contact, i) => (
                <ContactItem contact={contact} key={i} />
              ))
            }
            </div>
          </div>
        </section>
        <section className="contributor-section">
          <div className="contributor-body">
            <h3>{dataSource.contributorGuide.title}</h3>
            <p>{dataSource.contributorGuide.desc}</p>
            <div className="contributor-list">
            {
              dataSource.contributorGuide.list.map((contributor, i) => (
                <ContributorItem contributor={contributor} key={i} />
              ))
            }
            </div>
          </div>
        </section>
        <Footer logo="./img/nacos_gray.png" />
      </div>
    );
  }
}

export default Community;
