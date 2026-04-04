import { Box, Input, InputProps, Text } from "@chakra-ui/react"

export interface FormInputProps extends InputProps {
    error?: string;
    label: string;
}


export const FormInput: React.FC<FormInputProps> = ({ label, error, ...props }: FormInputProps) => {
    return <Box className="">
        <Text className="mb-[5px]">{label} {props.isRequired && <span>*</span>}</Text>
        <Input border={error ? `1px solid #EF4444f0` : "1px solid #E4E4E7"} className={`mb-[5px]`} {...props} />
        {error && <Text className="text-[#EF4444] ">Please enter the required field</Text>}
    </Box>
}