import { Select, Space } from 'antd';
import { type DataMapping } from "../MapApp"
import { tokens } from '../../utils/Tokens';
import { ConfigProvider } from 'antd';

export interface FilterOptProps{
    tagMapping : DataMapping | undefined
    setSelectedTags?: React.Dispatch<React.SetStateAction<number>> |undefined;

}
export const FilterOpt = ({ tagMapping, setSelectedTags }: FilterOptProps)  =>
// export const FilterOpt = ()  =>
    {
        // console.log("Valeur de tagMappign reçu dans FilterOption: ",tagMapping)
        if (setSelectedTags == undefined || tagMapping == undefined){
            return(
                <Select
                placeholder="Tags non disponible."
                disabled
                options={[{ value: 'pas de tags', label: 'pas de tags' }]}
                />
            )
        }
        const onChange = (value: number) => {
            setSelectedTags(value)
            console.log(`selected ${value}`);
        };

        const onSearch = (value: string) => {
            console.log('search:', value);
        }; 
        
        const getTagName = Object.entries(tagMapping).map(([idTag,nameTag]) =>(
            {
                value : Number(idTag),
                label : nameTag
            }
        ))        
        return(
                <Space wrap style={{flexDirection:"column", display:'flex', alignItems: 'start'}}>
                    <span className='fw-bold text-decoration-underline'>
                        Filtrer par Tags: 
                    </span>
                    <ConfigProvider
                        theme={{
                        components: {
                            Select: {
                            // Remplacez cette valeur par la couleur de votre choix (ex: un rose/rouge)
                            colorTextPlaceholder: '#fff', 
                            },
                        },
                        }}
                    >
                    <Select
                        showSearch={{ optionFilterProp: 'label', onSearch }}
                        style = {{
                            width:"200px",
                            backgroundColor: tokens.info,
                            color:'white'
                        }}
                        allowClear
                        placeholder = "Choisir un tag"
                        options={getTagName}
                        onChange={onChange}
                    />
                    </ConfigProvider>
                </Space>
        )
    } 