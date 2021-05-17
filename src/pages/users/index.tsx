import { Box, Button, Checkbox, Flex, Heading, Icon, Table, Tbody, Td, Text, Th, Thead, Tr, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import { RiAddLine, RiPencilLine } from "react-icons/ri";
import { Header } from "../../components/Header";
import { Pagination } from "../../components/Pagination";
import { Sidebar } from "../../components/Sidebar";
import { useQuery } from "react-query";
// import { Spinner } from "@chakra-ui/core";

export default function UserList(){

  const { data, isLoading, error } = useQuery('users', async () => {
    const res = await fetch('http://localhost:3000/api/users')
    const data = await res.json()

    return data;
  });

  const isWideVersion = useBreakpointValue({
    base: false,
    lg : true
  })

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p="8"
        >

          <Flex
            mb="8"
            justify="space-between"
            align="center"
          >
            <Heading size="lg" fontWeight="normal">Usuários</Heading>

            <Link href="/users/create" passHref>
              <Button
                as="a"
                size="sm"
                fontSize="sm"
                colorScheme="pink"
                cursor="pointer"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar Usuário
              </Button>
            </Link>
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              {/* <Spinner /> */}
            </Flex>

          ): error ? (
            <Flex justify="center">
              <Text>Error</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme="whiteAlpha">
                <Thead>
                  <Tr>
                    <Th px={["4", "4", "6"]} color="gray.300" width="8">
                      <Checkbox colorScheme="pink" />
                    </Th>
                    <Th>Usuário</Th>
                    <Th>Data de cadastro</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.users.map(user => (
                    <Tr key={user.id}>
                    <Td px={["4", "4", '6']}>
                      <Checkbox colorScheme="pink" />
                    </Td>
                    <Td>
                      <Box>
                        <Text fontWeight="bold">{user.name}</Text>
                        <Text fontSize="sm" color="gray">{user.email}</Text>
                      </Box>
                    </Td>
                    {isWideVersion && (<Td>{user.createdAt}</Td>)}
                    <Td>
                      <Button
                        as="a"
                        size="sm"
                        fontSize="sm"
                        colorScheme="purple"
                        cursor="pointer"
                        leftIcon={<Icon as={RiPencilLine} marginInlineEnd={isWideVersion ? "0rem" : "-0.5rem"} />}
                      >
                        {isWideVersion && ('Editar')}
                      </Button>
                    </Td>
                  </Tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination />
            </>
          )}
        </Box>
      </Flex>

    </Box>
  )
}