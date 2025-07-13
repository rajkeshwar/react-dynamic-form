import clsx from "clsx";
import { noop } from "lodash-es";

const FormGroupElement = ({
    values = [],
    vertical = false,
    template = noop,
  }) => {
    return (
      <div className={clsx("flex gap-4", { "flex-col": vertical })} type="radio">
        {values.map((field, idx) => (
          <div key={idx} className="flex items-center">
            {template(field, idx)}
            <label htmlFor={field.key} className="text-sm text-gray-700 ml-2">
              {field.name}
            </label>
          </div>
        ))}
      </div>
    );
  };
  
  export { FormGroupElement };