import React from 'react';
import { SelectVariant } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import {
  ButtonVariant,
  DropdownSelect,
  formatOptions,
  formatButtonProps,
  formatSelectProps,
  SelectDirection,
  SelectPosition,
  SplitButtonVariant
} from '../dropdownSelect';

describe('Select Component', () => {
  it('should render a basic component', () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ]
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should render a checkbox select', () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ],
      selectedOptions: ['world', 'ipsum'],
      variant: SelectVariant.checkbox,
      placeholder: 'multiselect test'
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component).toMatchSnapshot('checkbox select');
  });

  it('should apply patternfly select props based on wrapper props', () => {
    const props = {};

    expect(formatSelectProps(props)).toMatchSnapshot('select props, disabled');

    props.options = [];
    expect(formatSelectProps(props)).toMatchSnapshot('select props, no options, disabled');

    props.options = ['lorem', 'ipsum'];
    props.isDisabled = true;
    expect(formatSelectProps(props)).toMatchSnapshot('select props, options, disabled');

    props.placeholder = 'dolor sit';
    props.isDisabled = false;
    expect(formatSelectProps(props)).toMatchSnapshot('select props, placeholder');
  });

  it('should apply patternfly dropdown props based on wrapper props', () => {
    const props = {};

    expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, disabled');

    props.options = [];
    expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, no options, disabled');

    props.options = ['lorem', 'ipsum'];
    props.isDisabled = true;
    expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, options, disabled');

    props.placeholder = 'dolor sit';
    props.isDisabled = false;
    expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, placeholder');

    props.buttonVariant = ButtonVariant.plain;
    props.splitButtonVariant = SplitButtonVariant.checkbox;
    expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, button variants');
  });

  it('should allow alternate array and object options', () => {
    const props = {
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum']
    };

    expect(formatOptions(props).options).toMatchSnapshot('string array');

    props.options = { lorem: 'ipsum', hello: 'world' };
    props.selectedOptions = ['world', 'ipsum'];

    expect(formatOptions(props).options).toMatchSnapshot('key value object');

    props.options = [
      { title: 'lorem', value: 'ipsum' },
      { title: () => 'hello', value: 'world' }
    ];
    props.selectedOptions = ['world', 'ipsum'];

    expect(formatOptions(props).options).toMatchSnapshot('key value object');

    props.options = undefined;
    props.selectedOptions = [];

    expect(formatOptions(props).options).toMatchSnapshot('undefined options');
  });

  it('should allow plain objects as values, and be able to select options based on values within the object', () => {
    const props = {
      options: [
        { title: 'lorem', value: { dolor: 'sit' } },
        { title: 'dolor', value: { lorem: 'ipsum' } },
        { title: 'hello', value: { hello: 'world' } }
      ],
      selectedOptions: ['world']
    };

    expect(formatOptions(props).options).toMatchSnapshot('select when option values are objects');
  });

  it('should allow selected options to match value or title', () => {
    const props = {
      options: { lorem: 'ipsum', hello: 'world', dolor: 'set' },
      selectedOptions: ['world', 'lorem', 'fail'],
      variant: SelectVariant.checkbox
    };

    expect(formatOptions(props).options).toMatchSnapshot('value or title match');
  });

  it('should return an emulated onchange event', () => {
    const mockOnSelect = jest.fn();
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum'],
      onSelect: mockOnSelect
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    const firstButton = component.find('button');
    const mockEvent = { currentTarget: {}, target: {} };
    component.fireEvent.click(firstButton, mockEvent);

    const anotherButton = component.find('ul.pf-c-select__menu button');
    component.fireEvent.click(anotherButton, mockEvent);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect.mock.calls[0][0]).toMatchSnapshot('default emulated event');
  });

  it('should return an emulated onchange event, checklist variant', () => {
    const mockOnSelect = jest.fn();
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum'],
      onSelect: mockOnSelect,
      variant: SelectVariant.checkbox
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    const firstButton = component.find('button');
    const mockEvent = { currentTarget: {}, target: {} };
    component.fireEvent.click(firstButton, mockEvent);

    const firstCheckbox = component.find('ul.pf-c-select__menu input.pf-c-check__input');
    component.fireEvent.click(firstCheckbox, { target: { checked: true } });

    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    const secondCheckbox = component.querySelectorAll('ul.pf-c-select__menu input.pf-c-check__input')?.[1];
    component.fireEvent.click(secondCheckbox, { target: { checked: true } });

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect.mock.calls[1][0]).toMatchSnapshot('checklist emulated event, last item checked');
  });

  it('should render an expanded select', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    const firstButton = component.find('button');
    const mockEvent = { currentTarget: {}, target: {} };
    component.fireEvent.click(firstButton, mockEvent);

    expect(component.find('ul.pf-c-select__menu')).toMatchSnapshot('expanded');
  });

  it('should disable toggle text', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      toggleIcon: <FilterIcon />,
      isToggleText: false
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component.find('.quipucords-select-pf__no-toggle-text').className).toMatchSnapshot('disabled text');
  });

  it('should allow alternate direction and position options', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      direction: SelectDirection.up
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    const upLeftProps = component.find('.quipucords-select-pf');
    expect(upLeftProps.className).toMatchSnapshot('direction up');

    const posRight = component.setProps({ direction: SelectDirection.down, position: SelectPosition.right });
    const downRightProps = posRight.find('.quipucords-select-pf');
    expect(downRightProps.className).toMatchSnapshot('position right');
  });

  it('should allow being disabled with missing options', () => {
    const props = {
      id: 'test',
      options: undefined
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component).toMatchSnapshot('no options');

    const emptyOptions = component.setProps({
      options: [],
      isDisabled: false
    });

    expect(emptyOptions).toMatchSnapshot('options, but no content');

    const dis = component.setProps({
      options: ['lorem', 'ipsum', 'hello', 'world'],
      isDisabled: true
    });

    expect(dis).toMatchSnapshot('options, but disabled');
  });

  it('should allow data- props', () => {
    const props = {
      'data-lorem': 'ipsum',
      'data-dolor-sit': 'dolor sit'
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component.props).toMatchSnapshot('data- attributes');
  });

  it('should emulate pf dropdown', () => {
    const props = {
      isDropdownButton: true,
      buttonVariant: ButtonVariant.secondary,
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = renderComponent(<DropdownSelect {...props} />);
    expect(component).toMatchSnapshot('emulated dropdown');
  });
});
