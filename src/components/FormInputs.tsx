import React from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  label: string;
  name: string;
  type?: string;
  className?: string;
  value?: string;
  onclick?: () => void;
};

const FormInputs: React.FC<Props> = ({
  label,
  name,
  type = "text",
  className,
  value,
  onclick,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const autoResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {type === "textarea" ? (
        <textarea
          placeholder={label}
          defaultValue={value}
          onFocus={autoResize}
          onInput={autoResize}
          className={`${
            className
              ? className
              : "w-full overflow-hidden block resize-none h-auto outline-none rounded-[5px] cursor-text"
          }`}
          {...register(name)}
        />
      ) : (
        <input
          type={type}
          placeholder={label}
          defaultValue={value}
          onFocus={onclick}
          className={`${
            className
              ? className
              : "rounded-full border border-[#424769] h-14 bg-transparent outline-none px-3"
          }`}
          {...register(name)}
        />
      )}

      {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInputs;
