import React from "react";
import { getLink } from "../../utils";
import BrowserOnly from "@docusaurus/BrowserOnly";
type CardEvent = {
  link: string;
  img: string;
  title: string;
  content: string;
  dateStr: string;
};

type Props = {
  event: CardEvent;
};

const EventCard = (props: Props) => {
  const { event } = props;
  return (
    <BrowserOnly>
      {() => (
        <div className="event-card">
          <a href={getLink(event.link)}>
            <img src={`${event.img}`} />
          </a>
          <div className="event-introduction">
            <h4>{event.title}</h4>
            <p>{event.content}</p>
            <a href={getLink(event.link)}>
              {event.dateStr}
              <img
                className="arrow"
                src={`https://img.alicdn.com/imgextra/i4/O1CN01CWa2ug1T6YucJf3Ct_!!6000000002333-2-tps-16-26.png`}
              />
            </a>
          </div>
        </div>
      )}
    </BrowserOnly>
  );
};
export default EventCard;
