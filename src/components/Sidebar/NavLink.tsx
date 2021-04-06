import { Icon, Link as ChakaraLink, Text, LinkProps as ChakaraLinkProps } from "@chakra-ui/react";
import { ElementType } from "react";
import Link from "next/link";
import { ActiveLink } from "./ActiveLink";

interface NavLinkProps extends ChakaraLinkProps {
  icon:ElementType;
  children: string;
  href: string;
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps){
  return (
    <ActiveLink href={href} passHref>    
      <ChakaraLink display="flex" alignItems="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">{children}</Text>
      </ChakaraLink>
    </ActiveLink>
  )
}