import { Button } from "@chakra-ui/react";
import { HStack, Icon } from "@chakra-ui/react";
import { RiNotificationLine, RiUser2Line, RiLogoutBoxLine } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";

export function NotificationNav(){
  const { signOut } = useAuth()
  return (
    <HStack
      spacing={["6", "8"]}
      mx={["6", "8"]}
      pr={["6", "8"]}
      py="1"
      color="gray.300"
      borderRightWidth={1}
      borderColor="gray.700"
    >
      <Icon as={RiNotificationLine} fontSize="20" />
      <Icon as={RiUser2Line} fontSize="20" />
      <Button background="gray.900" onClick={() => signOut()}>
        <Icon as={RiLogoutBoxLine} fontSize="20" />
      </Button>
    </HStack>
  )
}