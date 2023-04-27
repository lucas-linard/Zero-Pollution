import {
  Input as NativeBaseInput,
  Text,
  IInputProps,
  FormControl,
} from "native-base";

type InputProps = IInputProps & {
  title?: string;
  errorMessage?: string | null;
};

export function Input({ title, errorMessage = null, isInvalid, ...rest }: InputProps) {
  const invalid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={invalid} mb={4}>
      {title && <Text color="green.600">{title}</Text>}
      <NativeBaseInput
        bg="gray.100"
        borderRadius="xl"
        h={"12"}
        px={4}
        fontSize="md"
        fontFamily="body"
        borderWidth="0"
        placeholderTextColor={"gray.300"}
        _focus={{
          bg: "gray.200",
          borderWidth: 1,
          borderColor: "green.500",
        }}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  );
}
