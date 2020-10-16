import PropTypes from "prop-types";
import React from "react";
import { Text, Stack, ActionButton } from "@fluentui/react";
import { connect } from "react-redux";
import { setSelectedId } from "../../services/ui/ui-actions";
import { replaceInstance } from "../../services/safe/safe-actions";
import { createUuid } from "../../services/safe/safe-services";
import { useTheme } from "../../services/ui/ui-services";
import { CvDetailsList } from "../widgets/CvDetailsList";
import { CvTextField } from "../widgets/CvTextField";
import { CvCheckbox } from "../widgets/CvCheckbox";

const entityName = "reference";

const Reference = (props) => {

  const compareStrings = (l, r) =>
    l < r ? -1 : l > r ? 1 : 0;

  // Find all {references} of the selected {cv}.
  const references = props.referenceEntity
    && props.selectedCvId
    && Object.values(props.referenceEntity).filter((instance) => instance.cvId === props.selectedCvId)
      .sort((l, r) => compareStrings(l.referentName, r.referentName))
    || [];

  const referenceContext = {
    locale: props.locale,
    entity: props.referenceEntity,
    entinstanceIdityId: props.selectedReferenceId,
    setSelectedInstance: props.setSelectedReferenceId,
    replaceInstance: props.replaceReference
  };

  const renderCheckbox = (item) =>
    <CvCheckbox
      field="includeInCv"
      instanceContext={{ ...referenceContext, instanceId: item._id }}
    />;

  const columns = [
    {
      key: "referentName",
      fieldName: "referentName",
      name: "Naam",
      isResizable: true,
      data: "string"
    },
    {
      key: "referentFunction",
      localeFieldName: "referentFunction",
      name: "Functie",
      isResizable: true,
      data: "string"
    },
    {
      key: "description",
      localeFieldName: "description",
      name: "Omschrijving",
      isResizable: true,
      data: "string"
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40
    }
  ];

  const { viewPaneColor, editPaneColor } = useTheme();
  const viewStyles = {
    root: [
      {
        background: viewPaneColor,
        padding: 20
      }
    ]
  };
  const editStyles = {
    root: [
      {
        background: editPaneColor,
        padding: 20
      }
    ]
  };

  let selection;
  const onExposeSelectionRef = (selectionRef) => {
    selection = selectionRef;
  };

  const onAddItem = () => {
    const id = createUuid();
    props.replaceReference(id, {
      _id: id,
      cvId: props.selectedCvId,
      includeInCv: true
    });
    props.setSelectedReferenceId(id);

    setTimeout(() => { // TODO: fix this
      selection.setAllSelected(false);
      selection.setKeySelected(id, true, false);
    }, 10);
  };

  const onDeleteItem = () => {
    if (props.selectedReferenceId) {
      props.replaceReference(props.selectedReferenceId, {});
      props.setSelectedReferenceId(undefined);
    }
  };

  return (
    <table width="100%" style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td width="50%" valign="top">
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between">
                <Text variant="xxLarge">Referenties</Text>
                <div>
                  <ActionButton
                    text="Toevoegen"
                    iconProps={{ iconName: "Add" }}
                    onClick={onAddItem}
                  />
                  <ActionButton
                    text="Verwijderen"
                    iconProps={{ iconName: "Delete" }}
                    disabled={!props.selectedReferenceId}
                    onClick={onDeleteItem}
                  />
                </div>
              </Stack>
              <CvDetailsList
                columns={columns}
                items={references}
                instanceContext={referenceContext}
                setKey={entityName}
                onExposeSelectionRef={onExposeSelectionRef}
              />
            </Stack>
          </td>

          <td width="50%" valign="top">
            <Stack styles={editStyles}>
              <CvTextField
                label="Naam"
                field="referentName"
                instanceContext={referenceContext}
              />
              <CvTextField
                label="Functie"
                localeField="referentFunction"
                instanceContext={referenceContext}
              />
              <CvTextField
                label="Omschrijving"
                localeField="description"
                instanceContext={referenceContext}
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Reference.propTypes = {
  locale: PropTypes.string.isRequired,
  selectedCvId: PropTypes.string,
  referenceEntity: PropTypes.object,
  replaceReference: PropTypes.func.isRequired,
  selectedReferenceId: PropTypes.string,
  setSelectedReferenceId: PropTypes.func.isRequired
};

const select = (state) => ({
  locale: state.ui.locale,
  selectedCvId: state.ui.selectedId["cv"],
  referenceEntity: state.safe.content[entityName],
  selectedReferenceId: state.ui.selectedId[entityName]
});

const mapDispatchToProps = (dispatch) => ({
  replaceReference: (id, instance) => dispatch(replaceInstance(entityName, id, instance)),
  setSelectedReferenceId: (id) => dispatch(setSelectedId(entityName, id))
});

export default connect(select, mapDispatchToProps)(Reference);