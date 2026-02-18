import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { Input, InputProps } from './Input';

interface InputPasswordProps extends InputProps {}

export const InputPassword: React.FC<InputPasswordProps> = ({ ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? 'text' : 'password'}
      iconRight={
        showPassword ? (
          <EyeOffIcon
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-chateau size-4"
          />
        ) : (
          <EyeIcon
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-chateau size-4"
          />
        )
      }
    />
  );
};
