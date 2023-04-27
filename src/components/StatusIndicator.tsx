import { Box, HStack, Text, IBoxProps } from "native-base";

type IndicatorProps = {
  title: string;
  isDone: boolean;
  isLast?: boolean;
};

function Indicator({ title, isDone, isLast = false }: IndicatorProps) {
  return (
    <>
      <HStack>
        <Box
          rounded="full"
          backgroundColor={isDone ? "green.800" : "gray.200"}
          width={5}
          height={5}
        />
        <Text fontFamily="body" color="green.800" fontSize="xs" ml={2}>
          {title}
        </Text>
      </HStack>
      {!isLast && (
        <Box
          ml={"8px"}
          mt={-1}
          w={1}
          h={50}
          bg={isDone ? "green.800" : "gray.200"}
        />
      )}
    </>
  );
}

export function StatusIndicator({status , ...rest}: IBoxProps & {status: number}) {
  return (
    <Box w="50%" {...rest}>
      <Indicator title="Ocorrência recebida" isDone={status === 0 ? true : false} />
      <Indicator title="Ocorrência confirmada" isDone={status === 1 ? true : false} />
      <Indicator title="Ocorrência em andamento" isDone={status === 2 ? true : false} />
      <Indicator title="Ocorrência finalizada" isDone={status === 3 ? true : false} isLast={true} />
    </Box>
  );
}
