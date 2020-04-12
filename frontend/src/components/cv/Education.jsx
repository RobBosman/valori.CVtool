import React from "react";
import { ChoiceGroup, Dropdown, Link, TextField } from "@fluentui/react";
import { DetailsList, DetailsListLayoutMode } from '@fluentui/react/lib/DetailsList';
import { connect } from "react-redux"
import { mapHelpers, replaceSafeInstance } from "../../redux/safe";

const educationTypes = [
  {
    key: "EDUCATION",
    text: 'Opleiding',
    iconProps: { iconName: 'PublishCourse' }
  },
  {
    key: "TRAINING",
    text: 'Training',
    iconProps: { iconName: 'UserEvent' }
  }
];

const resultTypes = [
  {
    key: "DIPLOMA",
    text: 'diploma'
  },
  {
    key: "CERTIFICATE",
    text: 'certificaat'
  },
  {
    key: "ONGOING",
    text: 'nog bezig'
  },
  {
    key: "CANCELED",
    text: 'afgebroken'
  },
  {
    key: "NOT_APPLICABLE",
    text: 'n.v.t.'
  }
];

const columns = [
  {
    key: 'type',
    fieldName: 'type',
    name: 'Soort opleiding',
    iconName: 'PublishCourse',
    isIconOnly: true,
    minWidth: 16,
    maxWidth: 80,
    // onColumnClick: this._onColumnClick,
    data: 'string'
  },
  {
    key: 'name',
    name: 'Opleiding',
    minWidth: 80,
    width: 200,
    maxWidth: 200,
    // isRowHeader: true,
    isResizable: true,
    isSorted: true,
    isSortedDescending: false,
    sortAscendingAriaLabel: 'Sorted A to Z',
    sortDescendingAriaLabel: 'Sorted Z to A',
    // onColumnClick: this._onColumnClick,
    data: 'string',
    isPadded: true,
    onRender: (education) => {
      return <span>{education.name['nl_NL']}</span>;
    },
  },
  {
    key: 'institution',
    fieldName: 'institution',
    name: 'Opleidingsinstituut',
    minWidth: 80,
    maxWidth: 200,
    width: 200,
    isResizable: true,
    // onColumnClick: this._onColumnClick,
    data: 'string',
    isPadded: true
  },
  {
    key: 'result',
    fieldName: 'result',
    name: 'Resultaat',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string'
  },
  {
    key: 'year',
    fieldName: 'year',
    name: 'Jaar',
    minWidth: 70,
    maxWidth: 90,
    isResizable: true,
    isCollapsible: true,
    data: 'string',
    // onColumnClick: this._onColumnClick,
    isPadded: true
  }
];

const Education = (props) => {

  const { instance: education, getValue, getValueLocale, onChange, onChangeLocale } = mapHelpers(props.educationEntity, props.educationId, props.onChange, props.locale);

  const educations = props.educationEntity ? Object.values(props.educationEntity) : [];

  const rows = educations.map((education) =>
    <tr key={education._id}>
      <td>
        <Dropdown
          options={educationTypes}
          disabled={!education}
          selectedKey={getValue('type', "EDUCATION")}
          onChange={onChange('type', (event, option) => option.key)} />
      </td>
      <td>
        <TextField
          disabled={!education}
          value={getValueLocale('name')}
          onChange={onChangeLocale('name')} />
      </td>
      <td>
        <TextField
          disabled={!education}
          value={getValue('institution')}
          onChange={onChange('institution')} />
      </td>
      <td>
        <Dropdown
          styles={{ dropdown: { width: 100 } }}
          options={resultTypes}
          disabled={!education}
          selectedKey={getValue('result')}
          onChange={onChange('result', (event, option) => option.key)} />
      </td>
      <td>
        <TextField
          styles={{ fieldGroup: { width: 100 } }}
          placeholder='yyyy'
          disabled={!education}
          value={getValue('year')}
          onChange={onChange('year')} />
      </td>
    </tr>
  );

  return (
    <div>

      <hr />
      <br />
      <hr />

      <DetailsList
        items={educations}
        columns={columns}
        // getKey={this._getKey}
        setKey="none"
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={1}
        isHeaderVisible={true}
      // onItemInvoked={this._onItemInvoked}
      />

      <hr />
      <br />
      <hr />

      <div>
        <ChoiceGroup
          label="Soort opleiding"
          options={educationTypes}
          disabled={!education}
          selectedKey={getValue('type', "EDUCATION")}
          onChange={onChange('type', (event, option) => option.key)} />
        <TextField
          label="Opleiding"
          disabled={!education}
          value={getValueLocale('name')}
          onChange={onChangeLocale('name')} />
        <TextField
          label="Opleidingsinstituut"
          disabled={!education}
          value={getValue('institution')}
          onChange={onChange('institution')} />
        <Dropdown
          label='Resultaat:'
          styles={{ dropdown: { width: 100 } }}
          options={resultTypes}
          disabled={!education}
          selectedKey={getValue('result')}
          onChange={onChange('result', (event, option) => option.key)} />
        <TextField
          label="Jaar"
          styles={{ fieldGroup: { width: 100 } }}
          placeholder='yyyy'
          disabled={!education}
          value={getValue('year')}
          onChange={onChange('year')} />
      </div>

      <hr />
      <br />
      <hr />

      <table>
        <thead><tr><th>Soort opleiding</th><th>Opleiding</th><th>Opleidingsinstituut</th><th>Resultaat</th><th>Jaar</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div >
  )
};

const select = (state) => ({
  locale: state.ui.locale,
  educationEntity: state.safe.education
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (id, instance) => dispatch(replaceSafeInstance('education', id, instance))
});

export default connect(select, mapDispatchToProps)(Education)