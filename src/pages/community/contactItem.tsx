import React from 'react';
import { getLink } from '../../utils';
import BrowserOnly from '@docusaurus/BrowserOnly';
type Props = {
  contact: ContactData;
};

export type ContactData = {
  imgHover: string;
  img: string;
  link: string;
  title: string;
};

type State = {
  img: string;
};

class ContactItem extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      img: props.contact?.img,
    };
  }

  onMouseOver = () => {
    this.setState({
      img: this.props.contact?.imgHover,
    });
  };

  onMouseOut = () => {
    this.setState({
      img: this.props.contact?.img,
    });
  };

  render() {
    const { contact } = this.props;
    const { img } = this.state;
    return (
      <BrowserOnly>
        {() => (
          <a
            className="contact-item"
            href={getLink(contact.link)}
            rel="noopener noreferrer"
            target="_blank"
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
          >
            <img src={getLink(img)} />
            <div>{contact.title}</div>
          </a>
        )}
      </BrowserOnly>
    );
  }
}

export default ContactItem;