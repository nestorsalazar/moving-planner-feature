
import { useDispatch, useSelector } from 'react-redux';

const Resume = () => {
    const { estmateInfo } = useSelector(state => state.general);
    return(
        <div className='container'>
            <div className='row'>
                <h3 className="mb-3 text-sm-start text-md-center">Resume</h3>
            </div>
            <div className='row mb-2 text-sm-start text-md-end'>
                <label className='col' >Date</label>
                <label className='col'>{estmateInfo.date}</label>
            </div>
            <div className='row  mb-2 text-sm-start text-md-end'>
                <label className='col' >Residence</label>
                <label className='col'>{estmateInfo.residence}</label>
            </div>
            <div className='row  mb-2 text-sm-start text-md-end'>
                <label className='col' >Rooms</label>
                <label className='col'>{estmateInfo.numberRooms}</label>
            </div>
            {estmateInfo?.additionals &&
                estmateInfo.additionals.map((x, index) => {
                    return (
                        <div className='row  mb-2 text-sm-start text-md-end' key={'item'+index}>
                            <label className='col' >{x.name}</label>
                            <label className='col'>{'$' + x.cost}</label>
                        </div>

                    )
                })
            }
            
            <div className='row mt-4 text-sm-start text-md-end'>
                <label className='col text-bold' >Total</label>
                <p className='col text-bold'>{'$' + (estmateInfo.totalCost ? estmateInfo.totalCost : '0.00')}</p>
            </div>
            <div className='col text-md-end'>
           
            </div>
            
        </div>        
    );

    

}

export default Resume;