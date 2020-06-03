import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import CvDropdown from "../widgets/CvDropdown";
import CvTextField from "../widgets/CvTextField";
import { SkillCategories, SkillLevels } from "./Enums";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import CvModal from "../widgets/CvModal";
import { setDialogConfig } from "../../services/ui/ui-actions";

const SkillEdit = (props) => {

  const skillContext = {
    ...props.instanceContext,
    replaceInstance: props.onChange
  };

  return (
    <CvModal
      isOpen={props.dialogConfig.isOpen || false}
      dismiss={() => props.setDialogConfig(false)}>
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
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig.skill || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance("skill", id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig("skill", {isOpen}))
});

export default connect(select, mapDispatchToProps)(SkillEdit);