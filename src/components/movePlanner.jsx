import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Calendar from "react-calendar";
import 'react-datepicker/dist/react-datepicker.module.css'
import 'react-calendar/dist/Calendar.css';
import moment from "moment";
import { Field, Formik, Form } from "formik";
import * as Yup from 'yup'
import { getEstimateCost } from "../services/getCosts";
import { setEstimateInfo, setLoading, setMovings } from "../redux/general.slides";
import Resume from "./resume";
import MovingList from "./movingList";
// import { FaCalendarAlt } from "react-icons/fa";
export const MovePlanner = () => {
    const { loading, estmateInfo } = useSelector(state => state.general);
    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const formRef = useRef(null);
    const [value, setValue] = useState(moment().format('MM-DD-YYYY'));
    const [showCalendar, setShowCalendar] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [invalidDate, setInvalidDate] = useState(false);
    const [initialValues, setInitialValues] = useState({
        date: "",
        residence: "",
        numberRooms: ""
    });

    const [additionals, setAdditionals] = useState([
        { name: 'Clean', cost: 123.5, available: true, checked: false },
        { name: "Laundry", cost: 103.6, available: true, checked: false },
        { name: "Packing", cost: 200.6, available: true, checked: false }
    ]
    );
    //validation schema
    const SignupSchema = Yup.object().shape({
        date: Yup.string()
            .required('Required'),
        residence: Yup.string()
            .required('Required'),
        numberRooms: Yup.string().required('Required'),
    });
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
            setShowCalendar(false);
        }
    };
    const handleSubmit = (values) => {
        if (invalidDate) return;
        dispatch(setLoading(true))
        setTimeout(() => {
            var cost = getEstimateCost(values)
            dispatch(setLoading(false))
            const data = {
                ...values,
                additionals: additionals.filter(x => x.checked),
                totalCost: cost
            }
            dispatch(setEstimateInfo(data))
           setCanSave(true);
        }, 2000)

    }

    const handleAvailabilityServices = (date) => {
        var currentDate = moment().startOf('day');
        setInvalidDate(date.startOf('day').diff(currentDate, 'days') < 2);
        if (date.startOf('day').diff(currentDate, 'days') < 2) return;
        var v = [];

        switch (date.day()) {
            case 6 || 7:
                v = additionals.map(x => {
                    return {
                        ...x,
                        available: x.name === 'Clean' ? false : true,
                        checked: x.name === 'Clean' ? false : x.checked,
                    }
                })
                break;
            case 1:
                v = additionals.map(x => {
                    return {
                        ...x,
                        available: x.name === 'Laundry' ? false : true,
                        checked: x.name === 'Laundry' ? false : x.checked,
                    }
                })
                break;
            case 2:
                v = additionals.map(x => {
                    return {
                        ...x,
                        available: x.name === 'Packing' ? false : true,
                        checked: x.name === 'Packing' ? false : x.checked,
                    }
                })
                break;
            default:
                v = additionals.map(x => {
                    return {
                        ...x,
                        available: true,
                    }
                })
                break;
        }
        setAdditionals(v);
    }
    const handleCheckChange = (item) => {
        var newAdditionals = additionals.map(x => {
            return {
                ...x,
                checked: x.name === item.name ? !item.checked : x.checked
            }
        })
        setAdditionals(newAdditionals);

    }

    const handleReset = ()=>{
        formRef.current.handleReset();
        dispatch(setEstimateInfo({}));
        var newAdditionals = additionals.map(x => {
            return {
                ...x,
                checked: false
            }
        })
        setAdditionals(newAdditionals);
        setCanSave(false);
    }
    const handleSaveInfo = () => {
        dispatch(setMovings(estmateInfo))
        setCanSave(false);
    }

    return (
        <div className="move-planner-container container mt-4">
            <h1>Move Planner</h1>

            <div className="row mt-4">

                <div className="col-12 col-md-6">
                    <h3 className="mb-3">Move Info</h3>
                    <Formik
                        innerRef={formRef}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={SignupSchema}
                    >{
                            ({ setFieldValue, errors, touched }) => (
                                <Form>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="calendarText" className="text-start col-sm-3 col-form-label">Date</label>
                                        <div className="col-sm-9">
                                            <Field onClick={() => setShowCalendar(!showCalendar)} className={`form-control ${errors.date && 'border border-danger'}`} name="date" />
                                            {/* <i className="m-2 bi bi-calendar3" onClick={() => setShowCalendar(!showCalendar)}></i> */}
                                            {invalidDate && <label className="error">Must be 3 days after current day</label>}
                                        </div>

                                        {showCalendar &&
                                            <div ref={calendarRef} className="calendar">
                                                <Calendar
                                                    onClickDay={(e) => { setShowCalendar(false); handleAvailabilityServices(moment(e)) }}
                                                    onChange={(e) => { setFieldValue('date', moment(e).format('DD-MM-YYYY')) }}
                                                    value={moment(value).format('MM-DD-YYYY')}>
                                                </Calendar>
                                            </div>
                                        }
                                    </div>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="residence" className="text-start col-sm-3 col-form-label">Residence</label>
                                        <div className="col-sm-9">
                                            <Field as='select' name='residence' className={`form-control ${errors.residence && 'border border-danger'}`} onChange={(e) => { setFieldValue('residence', e.target.value) }} >
                                                <option></option>
                                                <option>Appartament</option>
                                                <option>House</option>
                                                <option>Loft</option>
                                                <option>Studio</option>
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="form-group row mb-4">
                                        <label htmlFor="numberRooms" className="text-start col-sm-3 col-form-label">Rooms</label>
                                        <div className="col-sm-9 d-flex">
                                            <Field type="number" className={`form-control ${errors.numberRooms && 'border border-danger'}`} name="numberRooms" />
                                        </div>
                                    </div>


                                </Form>
                            )

                        }

                    </Formik>
                    <div className="col-12 text-start mb-4">
                        <h5>You can also add additional services:</h5>
                        <label>This are the availables services htmlFor your configuration:</label>
                    </div>
                    {additionals && additionals.map((item, index) => {
                        return (
                            <div className="col-sm-8" key={'item' + index}>
                                <div className="form-check d-flex">
                                    <label>
                                        <input
                                            disabled={!item.available}
                                            type="checkbox"
                                            className="form-check-input"
                                            name={`additionalService[${index}].name`}
                                            onChange={() => handleCheckChange(item)}
                                            checked={item.checked}
                                        />
                                        {item.name}
                                    </label>
                                </div>
                            </div>
                        )
                    })}

                    <div className="col-12 mb-4 text-md-end">
                        {!loading ?
                            <div>
                                <div className="mb-2">
                                <button type="button" className="btn btn-primary mx-2 col-md-4" onClick={() => formRef.current.submitForm()}>
                                    Get Estimate
                                </button>
                                <button type="button" className="btn btn-warning col-md-4" onClick={() => {handleReset() }}>
                                    Reset Information
                                </button>
                                </div>
                                <button disabled={!canSave} type="button" className="btn btn-success col-8" onClick={() => {handleSaveInfo() }}>
                                    Save Information
                                </button>
                            </div>
                            :
                            <div className="spinner-border col-12 col-md-6" role="status">
                                <span className="sr-only"></span>
                            </div>
                        }
                    </div>




                </div>
                
                <div className="col-12 col-md-6">
                    <Resume />
                </div>
                <div className="col-12 mt-4">
                    <MovingList/>
                </div>

            </div>

        </div>

    );
}

