import { Button as NativeBaseButton, IButtonProps, Text } from "native-base";

export type ButtonProps = IButtonProps & {
  title: string;
  variant?: "solid" | "outline";
};

export function Button({ title, variant = "solid", ...rest }: ButtonProps) {
  return (
    <NativeBaseButton
      bg={variant === "outline" ? "transparent" : "green.600" }
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor="green.500"
      h={10}
      rounded="lg"
      _pressed={{
        bg: "green.700",
      }}
      {...rest}
    >
      <Text color={variant === "outline" ? "green.500" : "white"} fontSize="sm" fontFamily="body">
        {title}
      </Text>
    </NativeBaseButton>
  );
}
