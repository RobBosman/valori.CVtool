import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import CvDropdown from "../widgets/CvDropdown";
import CvTextField from "../widgets/CvTextField";
import { SkillCategories, SkillLevels } from "./Enums";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import CvModal from "../widgets/CvModal";

const SkillEdit = (props) => {

  const skillContext = {
    ...props.instanceContext,
    replaceInstance: props.onChange
  };

  return (
    <CvModal
      isOpen={props.isOpen}
      dismiss={props.dismiss}>
      <CvDropdown
        label='Categorie'
        field="category"
        instanceContext={skillContext}
        options={SkillCategories[skillContext.locale]}
        styles={{ dropdown: { width: 200 } }} />
      <CvTextField
        label="Omschrijving"
        localeField="description"
        instanceContext={skillContext} />
      <CvDropdown
        label='Niveau'
        field="skillLevel"
        instanceContext={skillContext}
        options={SkillLevels}
        styles={{ dropdown: { width: 120 } }} />
    </CvModal>
  );
};

SkillEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  dismiss: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance("skill", id, instance))
});

export default connect(null, mapDispatchToProps)(SkillEdit);