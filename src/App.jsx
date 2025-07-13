import { Button } from "primereact/button";
import { genRandomId, serialize } from "./utils/dom";
import { keyBy } from "lodash";
import { useState } from "react";
import dayjs from "dayjs";
import { FormElement } from "./forms/FormElement";

const App = () => {
  const loginSchema = [
    {
      label: "Name of the Student",
      placeholder: "Enter full Name",
      type: "text",
      name: "studentName",
      value: "adsfaf",
    },
    {
      label: "Date of Birth",
      placeholder: "Enter full Name",
      type: "calendar",
      name: "dateOfBirth",
    },
    {
      label: "Gender",
      placeholder: "Please select",
      type: "dropdown",
      name: "gender",
      values: [
        { name: "Male", id: "MALE" },
        { name: "Female", id: "FEMALE" },
        { name: "Others", id: "OTHER" },
      ],
    },
    {
      label: "Phone number",
      placeholder: "Enter Phone Name",
      type: "masked",
      mask: "9999999999",
      name: "phoneNumber",
    },
  ];

  const formWithIds = loginSchema.map((f) => ({ ...f, id: genRandomId() }));

  const [formValue, setFormValue] = useState(formWithIds);

  const formSchemaMap = keyBy(formValue, "id");

  console.log("formWithIds ", formWithIds, formSchemaMap);

  const handleChange = (evt) => {
    console.log("handleChange ", evt);
    const { target, value } = evt;

    formSchemaMap[target.id].value = target.value;

    setFormValue([...formValue]);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const serializedValue = serialize(formValue);

    serializedValue.dateOfBirth = dayjs(serializedValue.dateOfBirth).format(
      "DD/MM/YYYY"
    );
    serializedValue.gender = serializedValue.gender.id;

    console.log("serializedValue ", serializedValue);
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      <h1 className="text-blue-700 bg-yellow-100 my-4 text-2xl p-4">
        React json driven form
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="sbte-form grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {formValue.map((field) => (
            <FormElement
              {...field}
              key={field.id}
              className="mb-4"
              onChange={handleChange}
              icon={field.icon}
              value={field.value}
            />
          ))}
        </div>
        <Button type="submit" label="Submit" className="sbte-button" />
      </form>
    </div>
  );
};

export default App;
