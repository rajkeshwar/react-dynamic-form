import clsx from "clsx";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FormElement } from "./FormElement";

const FormControl = ({
  label,
  className = "flex",
  iconPos = "left",
  icon,
  ...props
}) => {
  return (
    <div className={clsx("ux-form-control mb-4", className)}>
      <label
        htmlFor={label}
        className={clsx("inline-block text-sm font-medium text-gray-400 mb-2 h-4", props.labelClassName)}
        hidden={props.hidden}
      >
        {label}{" "}
        <span className="text-red-700" hidden={!props.required}>
          *
        </span>
      </label>
      <div className="flex-1 [&>*]:w-full">
        {icon ? (
          <IconField iconPosition={iconPos}>
            <InputIcon className={`pi pi-${icon}`} />
            <FormElement {...props} tooltip={props.tooltip} />
          </IconField>
        ) : (
          <FormElement {...props} tooltip={props.tooltip} />
        )}
      </div>
    </div>
  );
};

export { FormControl };