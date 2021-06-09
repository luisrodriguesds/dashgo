import { Box, Flex, SimpleGrid, Text, theme } from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { api } from "../services/apiClient";
import { withSRRAuth } from "../hocs/withSSRAuth";
import { setupAPIClient } from "../services/api";

// Layzeload
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
})

const options = {
  chart: {
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500]
  },
  grid: {
    show: false
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: [
      '2021-03-18T00:00:00.000Z',
      '2021-03-19T00:00:00.000Z',
      '2021-03-20T00:00:00.000Z',
      '2021-03-21T00:00:00.000Z',
      '2021-03-22T00:00:00.000Z',
      '2021-03-23T00:00:00.000Z',
      '2021-03-24T00:00:00.000Z',
    ]
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  }
};

const series = [
  { name: 'Series1', data: [21, 120, 135, 140, 69, 28, 13] }
];

export default function Dashboard(){
  useEffect(() => {
    const res = api.get('/me').then(res => console.log(res.data, 'result')).catch((err) => console.log(err))
  }, [])
  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignItems="flex-start"
        >
          <Box
            p={["6","8"]}
            bg="gray.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Inscritos da Semana</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

          <Box
            p={["6","8"]}
            bg="gray.800"
            borderRadius={8}
            pb="4"
          >
            <Text fontSize="lg" mb="4">Taxa de abertura</Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>

        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps = withSRRAuth(async (ctx) => {
  // Para conseguir usar o cookie no contexto do servidor
  const apiServer = setupAPIClient(ctx);
  const response = await apiServer.get('/me');
  console.log(response);
  return {
    props: {}
  }
})