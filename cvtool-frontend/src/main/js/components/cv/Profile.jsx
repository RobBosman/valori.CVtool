import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Checkbox, DefaultButton, Image, PrimaryButton, Stack, StackItem, Text } from "@fluentui/react";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import { CvFormattedText } from "../widgets/CvFormattedText";
import CvPhoto from "../widgets/CvPhoto";
import Preview, * as preview from "../cv/Preview";
import * as commonUtils from "../../utils/CommonUtils";
import * as uiActions from "../../services/ui/ui-actions";
import * as errorActions from "../../services/error/error-actions";
import { CvDetailsList } from "../widgets/CvDetailsList";
import ConfirmDialog from "../ConfirmDialog";
import { CvCheckbox } from "../widgets/CvCheckbox";

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
      const characs = characteristics
        .map(charac => ({
          ...charac,
          includeInCv: charac._id === instance._id
        }));
      for (const charac of characs) {
        props.replaceCharacteristics(charac._id, charac);
      }
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

  const [previewVisible, setPreviewVisible] = React.useState(false);

  const previewTitleStyle = {
    ...preview.cvTextStyle,
    color: valoriBlue,
    padding: "0 2px 0 2px"
  };
  const previewDashesStyle = {
    ...preview.cvTextStyle,
    color: valoriYellow,
    padding: "0 2px 0 2px"
  };
  const previewHeadingStyle = {
    ...preview.cvTextStyle,
    color: valoriBlue,
    borderColor: valoriYellow,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    padding: "12px 8px 0 8px"
  };
  const previewTextStyle = {
    backgroundColor: "white",
    color: valoriBlue,
    paddingTop: 0
  };

  const renderPreviewTitle = React.useCallback(() => {
    const account = Object.values(props.accountEntity || []).find(acc => acc._id === props.selectedAccountId);
    const characteristicsInCv = characteristics.find(characs => characs.includeInCv);
    const includePhotoInCv = characteristicsInCv.includePhotoInCv;
    const photoProps = { src: account.photo, alt: "Profielfoto", width: "10em", height: "10em" };
    return (
      <Stack horizontal horizontalAlign="end" verticalAlign="center">
        <Stack horizontalAlign="end">
          <Text style={{ ...previewTitleStyle, fontSize: "20pt", padding: "8px 8px 0 8px" }}>{account?.name?.toUpperCase()}</Text>
          <Stack horizontal>
            <Text style={previewTitleStyle}>{commonUtils.getValueOrFallback(characteristicsInCv, "role", props.locale)?.toUpperCase()}</Text>
            <Text style={previewDashesStyle}>{"//"}</Text>
            <Text style={previewTitleStyle}>{preview.formatDate(account?.dateOfBirth)}</Text>
            <Text style={previewDashesStyle}>{"//"}</Text>
            <Text style={previewTitleStyle}>{account?.residence?.toUpperCase()}</Text>
            <Text style={{ ...previewDashesStyle, padding: "0 8px 24px 2px" }}>{"//"}</Text>
          </Stack>
        </Stack>
        {account.photo && includePhotoInCv
          && <Image {...photoProps}></Image>
        }
      </Stack>
    );
  },
  [props.accountEntity, props.selectedAccountId, characteristics, props.locale]);

  const renderPreviewContent = React.useCallback(() => {
    const characteristicsInCv = characteristics.find(characs => characs.includeInCv);
    const characteristicsInCvContext = { ...characteristicsContext, instanceId: characteristicsInCv?._id };
    const hasInterests = characteristicsInCv?.interests?.[props.locale];
    return (
      <Stack
        tokens={{ childrenGap: "5px"}}
        styles={{ root: {
          backgroundColor: "white"
        } }}>
        <Text style={previewHeadingStyle}>
          <strong>{"Profielschets".toUpperCase()}</strong>
        </Text>
        <CvFormattedText
          field={`profile.${props.locale}`}
          instanceContext={characteristicsInCvContext}
          markDown={true}
          textComponentStyle={previewTextStyle}
        />
        {hasInterests
          && <Text style={previewHeadingStyle}>
            <strong>{"Interesses".toUpperCase()}</strong>
          </Text>
        }
        {hasInterests
          && <CvFormattedText
            field={`interests.${props.locale}`}
            instanceContext={characteristicsInCvContext}
            markDown={true}
            textComponentStyle={previewTextStyle}
          />
        }
      </Stack>
    );
  },
  [characteristics, characteristicsContext, props.locale]);

  const [confirmDialogVisible, setConfirmDialogVisible] = React.useState(false);

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
        _id: commonUtils.createUuid(),
        accountId: props.selectedAccountId,
        includeInCv: false,
        includePhotoInCv: true
      };
      selectCharacteristicsInCv(newCharacteristics);
    }
    props.setSelectedCharacteristicsId(newCharacteristics?._id);
  };

  const onDeleteItem = () => {
    if (props.selectedCharacteristicsId && characteristics.length >= 2) {
      // Only allow deleting a characteristic that is not included in the cv.
      if (characteristics.find(characs => characs._id === props.selectedCharacteristicsId)?.includeInCv) {
        props.showError("Een Profiel dat als 'In cv' is gemarkeerd kan niet worden verwijderd.");
      } else {
        setConfirmDialogVisible(true);
      }
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
      maxWidth: "calc(100vw - 200px)",
      textAlign: "left"
    }
  };
  const viewStyles = {
    root: {
      background: viewPaneBackground,
      padding: 20,
      minWidth: 350,
      height: "calc(100vh - 273px)"
    }
  };
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      maxWidth: "calc(100vw - 200px)",
      height: "calc(100vh - 273px)",
      overflowY: "auto"
    }
  };
  const tdStyle = {
    width: "calc(50vw - 98px)"
  };

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <th colSpan={2}>
            <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: "l1" }} styles={editAccountStyles}>
              <Stack vertical>
                <Stack horizontal tokens={{ childrenGap: "l1" }}>
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
                    styles={{ root: { width: 120, maxHeight: 60 } }}
                  />
                </Stack>
                <CvTextField
                  label="Woonplaats"
                  field="residence"
                  instanceContext={accountContext}
                  styles={{ root: { minWidth: 300 } }}
                />
              </Stack>
              <CvPhoto
                label={createHelpIcon({
                  label: "Foto",
                  content: <Text>
                    Optioneel: voeg je (pas)foto toe.
                    <br/>Als je je Cerios profielfoto wilt gebruiken moet je daarvoor (eenmalig) toestemming verlenen.
                    <br/>De foto moet een resolutie van ten minste {commonUtils.MIN_PHOTO_SIZE_PX}x{commonUtils.MIN_PHOTO_SIZE_PX} pixels hebben.
                    <br/>Zie ook de knop <em>Foto in cv opnemen</em> in de <strong>Profiel</strong> tab.
                  </Text>
                })}
                field="photo"
                instanceContext={accountContext}
              />
            </Stack>
          </th>
        </tr>

        <tr>
          <td valign="top" style={tdStyle}>
            <Stack styles={viewStyles}>
              <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: "l1" }}>
                <Text variant="xxLarge">Profiel</Text>
                {isEditable
                  && <StackItem>
                    <Stack horizontal tokens={{ childrenGap: "l1" }}>
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
                        title="Profiel definitief verwijderen?"
                        primaryButtonText="Verwijderen"
                        selectedItemFields={selectedItemFields}
                        isVisible={confirmDialogVisible}
                        onProceed={onDeleteConfirmed}
                        onCancel={onDeleteCancelled}
                      />
                    </Stack>
                  </StackItem>
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
            {isEditable
              ? <Stack styles={editStyles}>
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
                    isVisible={previewVisible}
                    rootStyles={{
                      width: 629,
                      height: 450
                    }}
                    renderContent={() =>
                      <div>
                        {renderPreviewTitle()}
                        {renderPreviewContent()}
                      </div>
                    }
                    onDismiss={() => setPreviewVisible(false)}
                  />
                  <StackItem>
                    <PrimaryButton
                      text="Preview"
                      iconProps={{ iconName: "EntryView" }}
                      onClick={() => setPreviewVisible(!previewVisible)}
                      style={{ top: "28px" }}
                    />
                  </StackItem>
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
                <CvCheckbox
                  label={createHelpIcon({
                    label: "Foto in cv opnemen",
                    content: <Text>Geef hier aan of je foto in het cv-document moet worden opgenomen.</Text>
                  })}
                  field="includePhotoInCv"
                  instanceContext={characteristicsContext}
                  styles={{ root: { paddingTop: 15 } }}
                />
              </Stack>
              : <Stack styles={editStyles}>
                {renderPreviewContent()}
              </Stack>
            }
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
  setSelectedCharacteristicsId: PropTypes.func.isRequired,
  showError: PropTypes.func.isRequired
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
  setSelectedCharacteristicsId: (id) => dispatch(uiActions.setSelectedId("characteristics", id)),
  showError: (errorMessage) => dispatch(errorActions.setLastError(errorMessage, errorActions.ErrorSources.USER_ACTION, null))
});

export default connect(select, mapDispatchToProps)(Profile);