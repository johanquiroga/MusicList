import React from 'react';
import { connect } from 'react-redux';
import Template from './Template';

const TemplateContainer = props => (
  <Template progress={props.progress} />
);

const mapStateToProps = state => ({
  progress: state.progress,
});

export default connect(mapStateToProps)(TemplateContainer);
