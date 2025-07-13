import { noop, startCase } from "lodash-es";
import { useState } from "react";

// PrimeReact Form Components
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { ColorPicker } from "primereact/colorpicker";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { ListBox } from "primereact/listbox";
import { MultiSelect } from "primereact/multiselect";
import { Password } from "primereact/password";
import { RadioButton } from "primereact/radiobutton";
import { Rating } from "primereact/rating";
import { SelectButton } from "primereact/selectbutton";
import { Slider } from "primereact/slider";
import { ToggleButton } from "primereact/togglebutton";

// Local Components
import { FormGroupElement } from "./FormGroupElement";
import { Switch } from "../utils/dom"; // Assuming Switch handles matching 'test' prop with child 'type' prop

const FormElement = ({
  id, // Unique ID for the form element, used for label association
  name, // Name attribute for the form element
  type, // Type of the form element to render (e.g., 'text', 'dropdown', 'number')
  value, // Current value of the form element
  label,
  required,
  placeholder, // Placeholder text
  onChange = noop, // Change handler function
  hidden = false, // Whether the element is hidden
  disabled = false, // Whether the element is disabled

  // Props for specific component types
  values = [], // Options for Dropdown, MultiSelect, Radio, Checkbox, SelectButton, Listbox etc.
  optionLabel = "name", // Property name for the label in options objects
  optionValue, // Property name for the value in options objects
  itemTemplate, // Custom template for items in list components

  // --- AutoComplete ---
  completeFn = noop, // Function for AutoComplete suggestions
  dropdown = false, // Show dropdown button on AutoComplete
  multiple = false, // Allow multiple selections (AutoComplete, MultiSelect, Listbox, SelectButton)
  field = "label", // Field of the suggestion object for AutoComplete (alternative to optionLabel)
  virtualScrollerOptions, // Virtual scrolling options for AutoComplete

  // --- Calendar ---
  showIcon, // Show calendar icon

  // --- Checkbox/Radio Group (via FormGroupElement) ---
  vertical, // Display radio/checkbox group vertically

  // --- Chips ---
  separator = ",", // Separator for Chips input
  allowDuplicate = true, // Allow duplicate values in Chips

  // --- ColorPicker ---
  format = "hex", // Format for ColorPicker ('hex', 'rgb', 'hsb')
  inline, // Display ColorPicker inline

  // --- Dropdown, Listbox, MultiSelect ---
  filter = false, // Enable filtering

  // --- InputMask ---
  mask, // Mask pattern for InputMask

  // --- InputNumber ---
  min, // Minimum value
  max, // Maximum value
  step, // Step value
  mode, // 'decimal' or 'currency'
  currency, // Currency symbol
  locale, // Locale for formatting
  minFractionDigits,
  maxFractionDigits,
  useGrouping = true, // Enable thousand separators

  // --- InputSwitch, ToggleButton ---
  onLabel = "Yes", // Label for 'on' state
  offLabel = "No", // Label for 'off' state

  // --- InputTextarea ---
  rows,
  cols,

  // --- MultiSelect ---
  maxSelectedLabels = 3, // Max selected items to display

  // --- Password ---
  feedback = false, // Show password strength feedback
  toggleMask = false, // Show toggle mask icon

  // --- Rating ---
  stars, // Number of stars for Rating
  cancel = true, // Allow cancelling Rating selection

  ...rest // Capture any other props passed down (e.g., className, style, tooltip, etc.)
}) => {
  const thePlaceholder =
    placeholder ?? (label ? `${startCase(label)}...` : undefined);
  // State specifically for the Checkbox group handled via FormGroupElement
  const [selectedChecks, setSelectedChecks] = useState(value ?? []);

  // Generalized onChange handler to provide a consistent event structure
  const handleOnChange = (e) => {
    let eventValue;
    let targetId = id; // Use the component's id prop
    let syntheticEvent = {
      target: {
        id: targetId,
        name: name,
        value: undefined,
        type: type, // Include the original component type for context
      },
      originalEvent: undefined,
    };

    // Special handling for Checkbox group managed by FormGroupElement
    // This relies on the structure passed by PrimeReact's Checkbox onChange
    if (type === "checkbox" && e && e.target && e.target.type === "checkbox") {
      const checkboxValue = e.value; // The value object of the clicked checkbox { key, name, ... }
      const isChecked = e.checked;

      const updatedSelectedChecks = isChecked
        ? [...selectedChecks, checkboxValue]
        : selectedChecks.filter((chk) => chk.key !== checkboxValue.key);

      setSelectedChecks(updatedSelectedChecks); // Update local state for checked status
      eventValue = updatedSelectedChecks; // The value for the group is the array of selected value objects
      syntheticEvent.originalEvent = e.originalEvent;
      syntheticEvent.target.checked = isChecked; // Add checked status if needed
    }
    // InputNumber uses onValueChange which passes { originalEvent, value }
    else if (type === "number" && e && typeof e.value !== "undefined") {
      eventValue = e.value;
      syntheticEvent.originalEvent = e.originalEvent;
    }
    // Standard HTML input event structure
    else if (e && e.target && typeof e.target.value !== "undefined") {
      eventValue = e.target.value;
      syntheticEvent.originalEvent = e; // Pass the original event
    }
    // Common PrimeReact component event structure { originalEvent, value, ... }
    else if (e && typeof e.value !== "undefined") {
      eventValue = e.value;
      syntheticEvent.originalEvent = e.originalEvent || e; // Pass original event if available
    }
    // Fallback: Pass the event data directly if structure is unknown
    else {
      eventValue = e;
      syntheticEvent.originalEvent = e;
    }

    syntheticEvent.target.value = eventValue;

    onChange(syntheticEvent); // Call the parent onChange with the normalized structure
  };

  return (
    <div className="w-full sbte-formfield">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
        {label}
        {required && <span className="text-red-700 ml-1">*</span>}
      </label>
      <Switch test={type}>
        {/* Default: InputText */}
        <InputText
          type="text"
          inputId={id}
          name={name}
          value={value ?? ""}
          onChange={handleOnChange}
          placeholder={thePlaceholder}
          hidden={hidden}
          disabled={disabled}
          className="w-full"
          {...rest}
        />
        <Password
          type="password"
          inputId={id}
          name={name}
          value={value ?? ""}
          onChange={handleOnChange}
          placeholder={thePlaceholder}
          feedback={feedback}
          toggleMask={toggleMask}
          hidden={hidden}
          disabled={disabled}
          className="w-full [&>input]:w-full"
          inputClassName="w-full"
          {...rest}
        />
        <InputTextarea
          type="textarea"
          inputId={id}
          name={name}
          value={value ?? ""}
          rows={rows ?? 5}
          cols={cols ?? 30}
          onChange={handleOnChange}
          placeholder={thePlaceholder}
          hidden={hidden}
          disabled={disabled}
          className="w-full"
          {...rest}
        />
        {/* Radio Button Group */}
        <FormGroupElement
          type="radio"
          values={values} // Expects array of { key, name/label, ... }
          vertical={vertical}
          template={(field) => (
            <RadioButton
              inputId={field.key} // Use key for unique ID
              name={name} // Group shares the same name
              value={field} // The entire field object is the value
              disabled={field.disabled || disabled} // Allow individual or group disabling
              onChange={handleOnChange}
              checked={value?.key === field.key} // Check if this field's key matches the selected value's key
            />
          )}
        />

        {/* Checkbox Group */}
        <FormGroupElement
          type="checkbox"
          values={values} // Expects array of { key, name/label, ... }
          vertical={vertical}
          template={(field) => (
            <Checkbox
              inputId={field.key}
              value={field} // The entire field object is the value
              disabled={field.disabled || disabled}
              name={field.name ?? field.label} // Individual name (optional)
              onChange={handleOnChange} // Uses the special handler logic above
              checked={selectedChecks.some((item) => item.key === field.key)} // Check based on local state
            />
          )}
        />

        <Dropdown
          type="dropdown"
          inputId={id}
          name={name}
          value={value}
          onChange={handleOnChange}
          options={values}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={thePlaceholder}
          filter={filter}
          hidden={hidden}
          disabled={disabled}
          className="w-full"
          {...rest}
        />

        <MultiSelect
          type="multiselect"
          inputId={id}
          name={name}
          value={value} // Expects an array
          onChange={handleOnChange}
          options={values}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={thePlaceholder}
          maxSelectedLabels={maxSelectedLabels}
          filter={filter}
          hidden={hidden}
          disabled={disabled}
          className="w-full"
          {...rest}
        />

        <AutoComplete
          type="autocomplete"
          inputId={id}
          name={name}
          value={value}
          suggestions={values} // Suggestions are typically managed by the parent via completeFn
          completeMethod={completeFn}
          field={field} // Field to display in suggestions
          optionLabel={optionLabel} // Can also use optionLabel if suggestions are objects
          dropdown={dropdown}
          multiple={multiple}
          virtualScrollerOptions={virtualScrollerOptions}
          placeholder={thePlaceholder}
          onChange={handleOnChange}
          hidden={hidden}
          disabled={disabled}
          className="w-full [&>input]:w-full [&>ul]:w-full" // Ensure inner elements take full width
          inputClassName="w-full"
          {...rest}
        />

        <Calendar
          type="calendar"
          inputId={id}
          name={name}
          showIcon={showIcon}
          value={value} // Expects Date object or array of Dates for range
          onChange={handleOnChange}
          placeholder={thePlaceholder}
          hidden={hidden}
          disabled={disabled}
          {...rest}
        />

        {/* --- Newly Added Components --- */}

        <div type="number" className="w-full">
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            {label}
            {required && <span className="text-red-700 ml-1">*</span>}
          </label>
          <InputNumber
            type="number"
            inputId={id}
            name={name}
            value={value}
            onValueChange={handleOnChange}
            placeholder={thePlaceholder}
            hidden={hidden}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            mode={mode}
            currency={currency}
            locale={locale}
            minFractionDigits={minFractionDigits}
            maxFractionDigits={maxFractionDigits}
            useGrouping={useGrouping}
            className="w-full"
            inputClassName="w-full"
            {...rest}
          />
        </div>

        <InputMask
          type="masked"
          id={id} // InputMask uses 'id' not 'inputId'
          name={name}
          value={value ?? ""}
          onChange={handleOnChange} // Standard onChange: { originalEvent, value }
          mask={mask}
          placeholder={thePlaceholder}
          hidden={hidden}
          disabled={disabled}
          className="w-full"
          {...rest}
        />

        <InputSwitch
          type="switch"
          inputId={id}
          name={name}
          checked={Boolean(value)} // Expects boolean
          onChange={handleOnChange} // Event: { originalEvent, value }
          hidden={hidden}
          disabled={disabled}
          tooltip={value ? onLabel : offLabel} // Use tooltip for labels if needed
          tooltipOptions={{ position: "top" }}
          {...rest}
        />

        <Slider
          type="slider"
          id={id} // Slider uses 'id'
          name={name}
          value={value} // Expects number or [number, number] for range
          onChange={handleOnChange} // Event: { originalEvent, value }
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          hidden={hidden}
          className="w-full"
          {...rest}
        />

        <SelectButton
          type="selectbutton"
          id={id} // SelectButton uses 'id'
          name={name}
          value={value}
          options={values}
          onChange={handleOnChange} // Event: { originalEvent, value }
          optionLabel={optionLabel}
          optionValue={optionValue}
          multiple={multiple}
          itemTemplate={itemTemplate}
          disabled={disabled}
          hidden={hidden}
          {...rest}
        />

        <ToggleButton
          type="togglebutton"
          id={id}
          name={name}
          checked={Boolean(value)} // Expects boolean
          onChange={handleOnChange} // Event: { originalEvent, value }
          onLabel={onLabel}
          offLabel={offLabel}
          disabled={disabled}
          hidden={hidden}
          {...rest}
        />

        <Chips
          type="chips"
          inputId={id}
          name={name}
          value={value} // Expects an array of strings/objects
          onChange={handleOnChange} // Event: { originalEvent, value }
          placeholder={thePlaceholder}
          separator={separator}
          allowDuplicate={allowDuplicate}
          disabled={disabled}
          hidden={hidden}
          className="w-full"
          inputClassName="w-full"
          {...rest}
        />

        <ColorPicker
          type="colorpicker"
          inputId={id}
          name={name}
          value={value} // Expects color string (e.g., 'ff0000')
          onChange={handleOnChange} // Event: { originalEvent, value }
          format={format}
          inline={inline}
          disabled={disabled}
          hidden={hidden}
          {...rest}
        />

        <ListBox
          type="listbox"
          id={id} // Listbox uses 'id'
          name={name}
          value={value}
          options={values}
          onChange={handleOnChange} // Event: { originalEvent, value }
          multiple={multiple}
          filter={filter}
          optionLabel={optionLabel}
          optionValue={optionValue}
          itemTemplate={itemTemplate}
          disabled={disabled}
          hidden={hidden}
          className="w-full border border-gray-300 rounded" // Add basic styling
          listStyle={{ maxHeight: "250px" }} // Example style
          {...rest}
        />

        <Rating
          type="rating"
          id={id} // Rating uses 'id'
          name={name}
          value={value} // Expects a number
          onChange={handleOnChange} // Event: { originalEvent, value }
          stars={stars}
          cancel={cancel}
          disabled={disabled}
          hidden={hidden}
          {...rest}
        />
      </Switch>
    </div>
  );
};

export  {FormElement};
