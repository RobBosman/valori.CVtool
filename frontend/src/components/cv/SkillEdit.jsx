import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Stack } from "@fluentui/react";
import { setDialogConfig } from "../../services/ui/ui-actions";
import { replaceSafeInstance } from "../../services/safe/safe-actions";
import { CvModal } from "../widgets/CvModal";
import { CvDropdown } from "../widgets/CvDropdown";
import { CvTextField } from "../widgets/CvTextField";
import { CvRating } from "../widgets/CvRating";
import { SkillCategories } from "./Enums";

const entityName = "skill";

const SkillEdit = (props) => {

  const skillContext = {
    ...props.instanceContext,
    replaceInstance: props.onChangeSkill
  };

  return (
    <CvModal
      title="Edit"
      isOpen={props.dialogConfig.isOpen || false}
      onDismiss={() => props.setDialogConfig(false)}>
      <Stack horizontal
        tokens={{ childrenGap: 20 }}>
        <CvDropdown
          label="Categorie"
          field="category"
          instanceContext={skillContext}
          options={SkillCategories[skillContext.locale]} />
        <CvTextField
          label="Omschrijving"
          localeField="description"
          instanceContext={skillContext} />
        <CvRating
          label="Niveau"
          field="skillLevel"
          instanceContext={skillContext} />
      </Stack>
    </CvModal>
  );
};

SkillEdit.propTypes = {
  instanceContext: PropTypes.object.isRequired,
  onChangeSkill: PropTypes.func.isRequired,
  dialogConfig: PropTypes.object.isRequired,
  setDialogConfig: PropTypes.func.isRequired
};

const select = (state) => ({
  dialogConfig: state.ui.dialogConfig[entityName] || {}
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSkill: (id, instance) => dispatch(replaceSafeInstance(entityName, id, instance)),
  setDialogConfig: (isOpen) => dispatch(setDialogConfig(entityName, {isOpen}))
});

export default connect(select, mapDispatchToProps)(SkillEdit);