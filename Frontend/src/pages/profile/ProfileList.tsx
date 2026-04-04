import { DataTable } from '@/components/ui/DataTable'
import { Box, Flex, Icon } from '@chakra-ui/react'
import { dealers } from '../dealerships/data/dealers'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import PageLayout from '@/templates/PageLayout'
import useSearchQuery from '@/hooks/useSearchQuery'
import useDebounce from '@/hooks/useDebounce'
import { IconArrowsDiagonal, IconX } from '@tabler/icons-react'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import { useProfile } from './profileContext'

const statusList = [
  { value: 'all', label: 'All Dealers' },
  { value: 'active', label: 'Active Dealers' },
  { value: 'draft', label: 'Draft Dealers' },
  { value: 'inactive', label: 'Inactive Dealers' },
]

export interface IProfileListProps {}

export default function ProfileList(props: IProfileListProps) {
  const navigation = useNavigate()
  const [status, setStatusFilterType] = useState('all')
  const {
    state: { profileList },
    actions: { getOne },
  } = useProfile()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)
  const { query, updateQuery } = useSearchQuery()
  const [loading, setLoading] = useState(true);

    
  useEffect(() => {
    if (Object.keys(query).length === 0) {
      return
    }
    if (profileList.length === 0) {
      setLoading(true);
    const fetchData = async () => {
      setLoading(true);
      try {
        await getOne();
      } catch (error) {
        console.error("Error occurred while fetching data:", error);
      } finally {
        // setLoading(false); // Always hide loader once data is fetched
      }
    };
    fetchData();
  }
    else{
      setLoading(false);
    }
    
  }, [query])



  console.log('loading', loading)
  console.log("Row data length:", profileList.length);
  console.log("query",query);

  return (
    <PageLayout
      title=''
      desctiprion=''
      rightContent={
        <Flex className='mb-[10px] flex-col items-end gap-[20px] md:flex-row md:gap-5'>
          
          <Box>
            <Label className='mb-[10px] text-sm text-muted-foreground'>
              Search
            </Label>
            <Flex className='relative'>
              <Input
                className='md:min-w-[350px]'
                placeholder='Search Name or App id...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Flex className='absolute right-[10px] h-[100%] items-center justify-center'>
                  <IconX
                    onClick={() => setSearchTerm('')}
                    className='cursor-pointer'
                  />
                </Flex>
              )}
            </Flex>
          </Box>
        </Flex>
      }
    >

    </PageLayout>
  )
}
