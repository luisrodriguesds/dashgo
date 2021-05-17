import { Flex, Button, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

type SignInFormData = {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required('Email obrigatório').email('Email inválido'),
  password: yup.string().required('Senha obrigatória')
})

export default function Home() {
  const { signIn } = useContext(AuthContext)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(signInFormSchema)
  });

  const handleSignIn: SubmitHandler<SignInFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    signIn(data)
  }

  return (
    <Flex w="100%" h="100vh" align="center" justify="center">
      {console.log(errors)}
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
          
          <Input 
            name="email" 
            label="E-mail" 
            type="email" 
            {...register('email')}
            error={errors.email} 
          />

          <Input 
            name="password" 
            label="Password" 
            type="password" 
            {...register('password')}
            error={errors.password} 
          />

          <Button type="submit" size="lg" colorScheme="pink" isLoading={isSubmitting}>
            Entrar
          </Button>
        </Stack>
      </Flex>
    </Flex>
  )
}
