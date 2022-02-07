import React from 'react';
import { Col, Row } from 'react-bootstrap';

export interface HeaderTextContent {
  title: string;
  content: string | number;
}

export interface HeaderTextProps {
  texts: Array<HeaderTextContent>;
}

const HeaderText: React.FC<HeaderTextProps> = ({ texts }: HeaderTextProps) => {
  return (
    <>
      <Row>
        {texts.map(({ content, title }: HeaderTextContent) => {
          return (
            <React.Fragment key={title}>
              <Col lg={6}>
                <h4 className="profile-detail__info--title mb-1">{title}</h4>
                <h3 className="profile-detail__info--subtitle">{content}</h3>
              </Col>
            </React.Fragment>
          );
        })}
      </Row>
    </>
  );
};

export default HeaderText;
