import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export function Profile(){
  return (
    <Flex
          align="center"
        >
      <Box textAlign="right" mr="4">
        <Text>Luis Rodrigues</Text>
        <Text color="gray.300" fontSize="small">
        luis@luis.com
        </Text>
      </Box>

      <Avatar size="md" name="Luis Rodrigues" src="https://github.com/luisrodriguesds.png" />
    </Flex>
  )
}