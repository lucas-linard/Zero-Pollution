import { Text, Image, Box } from "native-base";

import { Button } from "@components/Button";

type RecordProps = {
  title: string;
  image: string;
  description: string;
  onPress?: () => void;
};

export function RecordCard({ title, image, onPress, description }: RecordProps) {
  return (
      <Box size={153} mx={2} mb={16}>
      <Image
        alt="Cidade metade poluída e metade limpa"
        source={{uri : image }}
        width={153}
        height={86.25}
        resizeMode="contain"
      />
      <Text textAlign="center" fontFamily="body" color="green.800" numberOfLines={1}>
        {title}
      </Text>
      <Text textAlign="center" fontSize={"xs"} color="green.800" numberOfLines={1}>
        {description}
      </Text>
      <Button title="Acompanhar" onPress={onPress} h={10} />
      
    </Box>
  );
}
