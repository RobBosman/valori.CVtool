import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Checkbox, DefaultButton, PrimaryButton, Stack, StackItem, Text } from "@fluentui/react";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import { CvFormattedText } from "../widgets/CvFormattedText";
import Preview, * as preview from "../cv/Preview";
import * as commonUtils from "../../utils/CommonUtils";
import * as uiActions from "../../services/ui/ui-actions";
import { CvDetailsList } from "../widgets/CvDetailsList";
import ConfirmDialog from "../ConfirmDialog";
import { createUuid } from "../../services/safe/safe-services";

const Profile = (props) => {

  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);

  const characteristics = React.useMemo(() =>
    Object.values(props.characteristicsEntity || {})
      .filter(instance => instance.accountId === props.selectedAccountId),
  [props.characteristicsEntity, props.selectedAccountId]);
  
  React.useEffect(() => {
    if (!props.selectedCharacteristicsId) {
      props.setSelectedCharacteristicsId(characteristics.find(characs => characs.includeInCv)?._id);
    }
  });

  const characteristicsContext = {
    locale: props.locale,
    entity: props.characteristicsEntity,
    instanceId: props.selectedCharacteristicsId,
    setSelectedInstanceId: props.setSelectedCharacteristicsId,
    replaceInstance: props.replaceCharacteristics,
    readOnly: !isEditable
  };
  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    instanceId: props.selectedAccountId,
    replaceInstance: props.replaceAccount,
    readOnly: !isEditable
  };

  const {editPaneBackground, viewPaneBackground, valoriBlue, valoriYellow} = useTheme();

  const selectCharacteristicsInCv = (instance) => {
    if (instance.includeInCv) {
      characteristics
        .map(characs => ({ ...characs, includeInCv: characs._id === instance._id }))
        .forEach(characs => props.replaceCharacteristics(characs._id, characs));
    } else {
      props.replaceCharacteristics(instance._id, instance);
    }
  };

  const renderInCvCheckbox = React.useCallback((item) =>
    <Checkbox
      checked={item.includeInCv}
      onChange={() => {
        if (!item.includeInCv) {
          selectCharacteristicsInCv({ ...item, includeInCv: true });
        }
      }}
    />,
  [characteristics]);

  const columns = [
    {
      key: "name",
      fieldName: `role.${props.locale}`,
      name: "Rol",
      isResizable: true
    },
    {
      key: "includeInCv",
      fieldName: "includeInCv",
      name: "In cv",
      onRender: renderInCvCheckbox,
      isResizable: false,
      minWidth: 40,
      maxWidth: 40,
      data: "boolean"
    }
  ];

  const [isPreviewVisible, setPreviewVisible] = React.useState(false);

  const previewTitleStyle = {
    ...preview.cvTextStyle,
    color: valoriBlue,
    borderColor: valoriYellow,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    margin: "12px 8px 0 8px"
  };
  const previewTextStyle = {
    backgroundColor: "white",
    color: valoriBlue,
    paddingTop: 0
  };

  const renderPreview = React.useCallback(() => {
    const characteristicsInCv = characteristics.find(characs => characs.includeInCv);
    const characteristicsInCvCotext = { ...characteristicsContext, instanceId: characteristicsInCv?._id };
    const hasProfile = characteristicsInCv?.profile && characteristicsInCv.profile[props.locale];
    const hasInterests = characteristicsInCv?.interests && characteristicsInCv.interests[props.locale];
    return (
      <Stack tokens={{ childrenGap: "5px"}}>
        {hasProfile
          && <Text style={previewTitleStyle}>
            <strong>{"Profielschets".toUpperCase()}</strong>
          </Text>
        }
        {hasProfile
          && <CvFormattedText
            field={`profile.${props.locale}`}
            instanceContext={characteristicsInCvCotext}
            markDown={true}
            textComponentStyle={previewTextStyle}
          />
        }
        {hasInterests
          && <Text style={previewTitleStyle}>
            <strong>{"Interesses".toUpperCase()}</strong>
          </Text>
        }
        {hasInterests
          && <CvFormattedText
            field={`interests.${props.locale}`}
            instanceContext={characteristicsInCvCotext}
            markDown={true}
            textComponentStyle={previewTextStyle}
          />
        }
      </Stack>
    );
  },
  [characteristics, characteristicsContext, props.locale]);

  const [isConfirmDialogVisible, setConfirmDialogVisible] = React.useState(false);

  const selectedItemFields = React.useCallback(() => {
    const selectedCharacteristics = characteristics.find(characs => characs._id === props.selectedCharacteristicsId);
    const profileText = commonUtils.getValueOrFallback(selectedCharacteristics, "profile", props.locale);
    return selectedCharacteristics && {
      Rol: commonUtils.getValueOrFallback(selectedCharacteristics, "role", props.locale) || "-",
      Profielschets: profileText.length > 20 ? `${profileText.substring(0, 20)}...` : profileText || "-"
    };
  },
  [characteristics, props.selectedCharacteristicsId, props.locale]);

  const isFilledCharacteristics = (someCharacteristics) =>
    commonUtils.getValueOrFallback(someCharacteristics, "role", props.locale)
    || commonUtils.getValueOrFallback(someCharacteristics, "profile", props.locale);

  const onAddItem = () => {
    let newCharacteristics = characteristics.find(characs => !isFilledCharacteristics(characs));
    if (!newCharacteristics) {
      newCharacteristics = {
        _id: createUuid(),
        accountId: props.selectedAccountId,
        includeInCv: false
      };
      selectCharacteristicsInCv(newCharacteristics);
    }
    props.setSelectedCharacteristicsId(newCharacteristics?._id);
  };

  const onDeleteItem = () => {
    if (props.selectedCharacteristicsId && characteristics.length >= 2) {
      setConfirmDialogVisible(true);
    }
  };
  const onDeleteConfirmed = () => {
    setConfirmDialogVisible(false);
    if (props.selectedCharacteristicsId && characteristics.length >= 2) {
      props.replaceCharacteristics(props.selectedCharacteristicsId, {});
      props.setSelectedCharacteristicsId(undefined);
    }
  };
  const onDeleteCancelled = () =>
    setConfirmDialogVisible(false);

  const editAccountStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      maxWidth: "calc(100vw - 200px)"
    }
  };
  const viewCharacteristicsStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 350,
      height: "calc(100vh - 273px)"
    }
  };
  const editCharacteristicsStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      maxWidth: "calc(100vw - 200px)",
      height: "calc(100vh - 273px)"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td colSpan={2}>
            <Stack horizontal
              styles={editAccountStyles}
              tokens={{ childrenGap: "l1" }}>
              <CvTextField
                label="Naam"
                field="name"
                instanceContext={accountContext}
                styles={{ root: { minWidth: 300 } }}
              />
              <CvDatePicker
                label="Geboortedatum"
                field="dateOfBirth"
                instanceContext={accountContext}
                styles={{ root: { minWidth: 120, maxHeight: 60 } }}
              />
              <CvTextField
                label="Woonplaats"
                field="residence"
                instanceContext={accountContext}
                styles={{ root: { minWidth: 300 } }}
              />
            </Stack>
          </td>
        </tr>

        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewCharacteristicsStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Profiel</Text>
                {isEditable
                  && <Stack horizontal
                    tokens={{ childrenGap: "l1" }}>
                    <DefaultButton
                      text="Toevoegen"
                      iconProps={{ iconName: "Add" }}
                      onClick={onAddItem}
                    />
                    <DefaultButton
                      text="Verwijderen"
                      iconProps={{ iconName: "Delete" }}
                      disabled={!props.selectedCharacteristicsId || characteristics.length < 2}
                      onClick={onDeleteItem}
                    />
                    <ConfirmDialog
                      title="Definitief verwijderen?"
                      primaryButtonText="Verwijderen"
                      selectedItemFields={selectedItemFields}
                      isVisible={isConfirmDialogVisible}
                      onProceed={onDeleteConfirmed}
                      onCancel={onDeleteCancelled}
                    />
                  </Stack>
                }
              </Stack>
              <CvDetailsList
                columns={columns}
                items={characteristics}
                instanceContext={characteristicsContext}
                setKey="characteristics"
              />
            </Stack>
          </td>

          <td valign="top" style={tdStyle}>
            <Stack styles={editCharacteristicsStyles}>
              <Stack horizontal horizontalAlign="space-between"
                tokens={{ childrenGap: "l1" }}>
                <StackItem grow>
                  <CvTextField
                    label="Rol"
                    field={`role.${props.locale}`}
                    instanceContext={characteristicsContext}
                    placeholder={commonUtils.getPlaceholder(characteristics, props.selectedCharacteristicsId, "role", props.locale)}
                  />
                </StackItem>
                <Preview
                  isVisible={isPreviewVisible}
                  rootStyles={{
                    width: 629,
                    height: 450
                  }}
                  renderContent={renderPreview}
                  onDismiss={() => setPreviewVisible(false)}
                />
                <PrimaryButton
                  text="Preview"
                  iconProps={{ iconName: "EntryView" }}
                  onClick={() => setPreviewVisible(!isPreviewVisible)}
                  style={{ top: "28px" }}
                />
              </Stack>
              <CvTextField
                label={createHelpIcon({
                  label: "Profielschets",
                  content:
                    <Text>
                      Geef een omschrijving van jezelf en je belangrijkste persoonlijke eigenschappen
                      <br/>en je professionele skills en ervaring.
                      <br/>Deze tekst schrijf je in de derde persoon.
                    </Text>
                })}
                field={`profile.${props.locale}`}
                instanceContext={characteristicsContext}
                multiline
                autoAdjustHeight
              />
              <CvTextField
                label={createHelpIcon({
                  label: "Interesses",
                  content:
                    <Text>
                      Beschrijf hier alleen hobby&apos;s en/of interesses die jou als persoon typeren.
                      <br/>Geen simpele opsomming van voor de hand liggende bezigheden
                      <br/>zoals uitgaan met vrienden.
                    </Text>
                })}
                field={`interests.${props.locale}`}
                instanceContext={characteristicsContext}
                multiline
                autoAdjustHeight
              />
            </Stack>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Profile.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  characteristicsEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  accountEntity: PropTypes.object,
  replaceAccount: PropTypes.func.isRequired,
  replaceCharacteristics: PropTypes.func.isRequired,
  selectedCharacteristicsId: PropTypes.string,
  setSelectedCharacteristicsId: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  accountEntity: store.safe.content.account,
  selectedCharacteristicsId: store.ui.selectedId.characteristics,
  characteristicsEntity: store.safe.content.characteristics
});

const mapDispatchToProps = (dispatch) => ({
  replaceAccount: (id, instance) => dispatch(changeInstance("account", id, instance)),
  replaceCharacteristics: (id, instance) => dispatch(changeInstance("characteristics", id, instance)),
  setSelectedCharacteristicsId: (id) => dispatch(uiActions.setSelectedId("characteristics", id))
});

export default connect(select, mapDispatchToProps)(Profile);