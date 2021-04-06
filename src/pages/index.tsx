import { Flex, Button, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
}

export default function Home() {
  const { register, handleSubmit, formState } = useForm();

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(data);

  }

  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      <Flex
        as="form"
        w="100%"
        maxW={360}
        bg="gray.800"
        p="8"
        borderRadius={8}
        flexDirection="column"
        onSubmit={handleSubmit(handleSignIn)}
      >
        <Stack spacing="4">
          
          <Input name="email" label="E-mail" type="email" {...register('email')} />

          <Input name="password" label="Password" type="password" {...register('password')} />

          <Button type="submit" size="lg" colorScheme="pink" isLoading={formState.isSubmitting}>
            Entrar
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
}
