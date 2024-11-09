

import { useDispatch, useSelector } from 'react-redux';

const MovingList = () => {
    const { movings } = useSelector(state => state.general);
    return (
        <>
        <h3>Movings</h3>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Residence</th>
                    <th scope="col">Rooms</th>
                    <th scope="col">Cleaning</th>
                    <th scope="col">Laundry</th>
                    <th scope="col">Packing</th>
                    <th scope="col">Total</th>
                </tr>
            </thead>
            <tbody>
                {movings && movings.length > 0 && movings.map((item, index) => {
                    return (
                        <tr key={'item'+index}>
                            
                            <td>{item.date}</td>
                            <td>{item.residence}</td>
                            <td>{item.numberRooms}</td>
                            <td>{item.additionals.filter(x =>x.name == 'Clean') ? 'Yes':'No'}</td>
                            <td>{item.additionals.filter(x =>x.name == 'Laundry') ? 'Yes':'No'}</td>
                            <td>{item.additionals.filter(x =>x.name == 'Packing') ? 'Yes':'No'}</td>
                            <td>{item.totalCost}</td>
                        </tr>
                    )

                })}

            </tbody>
        </table>
        </>
    )
}

export default MovingList;