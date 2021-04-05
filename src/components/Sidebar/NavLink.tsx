import { Icon, Link, Text, LinkProps as ChakaraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";

interface NavLinkProps extends ChakaraLinkProps {
  icon:ElementType;
  children: string;
}

export function NavLink({ icon, children, ...rest }: NavLinkProps){
  return (
    <Link display="flex" alignItems="center" {...rest}>
      <Icon as={icon} fontSize="20" />
      <Text ml="4" fontWeight="medium">{children}</Text>
    </Link>
  )
}