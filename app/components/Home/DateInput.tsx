import React, { useState, useEffect, forwardRef } from "react";

type Props = {
  name: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const DateInput = forwardRef<HTMLInputElement, Props>(
  ({ name, defaultValue, onChange, className = "" }, ref) => {
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
      const isIOSDevice =
        typeof window !== "undefined" &&
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !("MSStream" in window);
      setIsIOS(isIOSDevice);
    }, []);

    const combinedClassName = `${className} ${isIOS ? "no-icon" : ""}`;

    return (
      <input
        ref={ref}
        type="date"
        name={name}
        defaultValue={defaultValue}
        onChange={onChange}
        className={combinedClassName.trim()}
      />
    );
  }
);

DateInput.displayName = "DateInput";
export default DateInput;
