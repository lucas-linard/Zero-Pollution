import { Text, IHeadingProps, Heading } from "native-base";

type HeaderProps = IHeadingProps &  {
  title: string;
};

export function Header({ title, ...rest }: HeaderProps) {
  return (
    <Heading
      fontFamily="heading"
      color="green.800"
      fontSize="4xl"
      alignSelf="center"
      {...rest}
    >
      {title}
    </Heading>
  );
}
