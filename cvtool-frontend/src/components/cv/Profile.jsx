import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { PrimaryButton, Stack, StackItem, Text } from "@fluentui/react";
import { changeInstance } from "../../services/safe/safe-actions";
import { useTheme } from "../../services/ui/ui-services";
import { CvDatePicker } from "../widgets/CvDatePicker";
import { CvTextField } from "../widgets/CvTextField";
import { createHelpIcon } from "../widgets/CvHelpIcon";
import { CvFormattedText } from "../widgets/CvFormattedText";
import Preview, * as preview from "../cv/Preview";
import * as commonUtils from "../../utils/CommonUtils";

const Profile = (props) => {

  const characteristics = Object.values(props.characteristicsEntity || {}).find(instance => instance.accountId === props.selectedAccountId);
  const isEditable = commonUtils.isEditAccountAllowed(props.selectedAccountId, props.authInfo);

  const characteristicsContext = {
    locale: props.locale,
    entity: props.characteristicsEntity,
    instanceId: characteristics?._id,
    replaceInstance: props.onCharacteristicsChange,
    readOnly: !isEditable
  };
  const accountContext = {
    locale: props.locale,
    entity: props.accountEntity,
    instanceId: props.selectedAccountId,
    replaceInstance: props.onAccountChange,
    readOnly: !isEditable
  };
  const {editPaneBackground, valoriBlue, valoriYellow} = useTheme();
  const editStyles = {
    root: {
      background: editPaneBackground,
      padding: 20,
      maxWidth: "calc(100vw - 200px)",
      height: "calc(100vh - 170px)"
    }
  };

  const [isPreviewVisible, setPreviewVisible] = React.useState(false);

  const renderPreview = React.useCallback(() => {
    const hasInterests = characteristics?.interests && characteristics.interests[props.locale];
    return (
      <Stack tokens={{ childrenGap: "5px"}}>
        <CvFormattedText
          field={`profile.${props.locale}`}
          instanceContext={characteristicsContext}
          markDown={true}
          textComponentStyle={{
            backgroundColor: "white",
            color: valoriBlue
          }}
        />
        {hasInterests
          && <Text
            style={{
              ...preview.cvTextStyle,
              color: valoriBlue,
              borderColor: valoriYellow,
              borderBottomWidth: 1,
              borderBottomStyle: "solid",
              margin: "12px 8px 0 8px"
            }}>
            <strong>{"Interesses".toUpperCase()}</strong>
          </Text>
        }
        {hasInterests
          && <CvFormattedText
            field={`interests.${props.locale}`}
            instanceContext={characteristicsContext}
            markDown={true}
            textComponentStyle={{
              backgroundColor: "white",
              color: valoriBlue,
              paddingTop: 0
            }}
          />
        }
      </Stack>
    );
  },
  [characteristicsContext, props.locale]);

  return (
    <Stack styles={editStyles}>
      <Text variant="xxLarge">Profiel</Text>
      <Stack horizontal
        tokens={{ childrenGap: "l1" }}>
        <Stack
          styles={{ root: { width: "50%" } }}>
          <CvTextField
            label="Naam"
            field="name"
            instanceContext={accountContext}
          />
          <CvTextField
            label="Rol"
            field={`role.${props.locale}`}
            instanceContext={characteristicsContext}
            placeholder={commonUtils.getValueOrFallback(characteristics, "role", props.locale)}
          />
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
        </Stack>
        <Stack
          styles={{ root: { width: "50%" } }}>
          <Stack horizontal horizontalAlign="space-between"
            tokens={{ childrenGap: "l1" }}>
            <StackItem grow>
              <CvTextField
                label="E-mail"
                field="email"
                instanceContext={accountContext}
                readOnly={true}
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
          <Stack horizontal
            tokens={{ childrenGap: "l1" }}>
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
              styles={{ root: { width: "100%" } }}
            />
          </Stack>
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
      </Stack>
    </Stack>
  );
};

Profile.propTypes = {
  authInfo: PropTypes.object,
  locale: PropTypes.string.isRequired,
  characteristicsEntity: PropTypes.object,
  selectedAccountId: PropTypes.string,
  accountEntity: PropTypes.object,
  onAccountChange: PropTypes.func.isRequired,
  onCharacteristicsChange: PropTypes.func.isRequired
};

const select = (store) => ({
  authInfo: store.auth.authInfo,
  locale: store.ui.userPrefs.locale,
  selectedAccountId: store.ui.selectedId.account,
  accountEntity: store.safe.content.account,
  characteristicsEntity: store.safe.content.characteristics
});

const mapDispatchToProps = (dispatch) => ({
  onAccountChange: (id, instance) => dispatch(changeInstance("account", id, instance)),
  onCharacteristicsChange: (id, instance) => dispatch(changeInstance("characteristics", id, instance))
});

export default connect(select, mapDispatchToProps)(Profile);