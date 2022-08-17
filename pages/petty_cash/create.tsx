import { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useMutation } from "@apollo/client";
import GrantSelect from "../../components/grantSelect";
import { CREATE_PETTY_CASH } from "../../graphql/mutations";
import { PettyCashInput } from "../../types/pettycash";
export default function CreateRequest() {
    const [addRequest, { data, loading, error }] = useMutation(CREATE_PETTY_CASH)
    const [receipts, setReceipts] = useState([]);
    const [requestDate, setDate] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState(0.0)
    const [grantID, setGrantID] = useState("")
    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;
    const handleDescription = (e: any) => {
        e.target.value.length < 76 &&
            setDescription(e.target.value)
    }
    const onChange = (
        receiptList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        // data for submit
        console.log(receiptList)
        console.log(addUpdateIndex)
        setReceipts(receiptList as never[]);
    };
    const maxNumber = 5;
    const submitRequest = async (e: any) => {
        e.preventDefault();
        const receiptArr: string[] = receipts.map((receipt: any) => receipt.data_url)
        if (description.length === 0) { alert('add a description'); return }
        if (grantID === "") { alert('select a grant'); return }
        if (amount === 0.0) { alert('add an amount'); return }
        const testUserID = '68125e1f-21c1-4f60-aab0-8efff5dc158e'
        console.log(requestDate)
        addRequest({
            variables: {
                user_id: testUserID,
                grant_id: grantID,
                request: {
                    amount: amount,
                    description: description,
                    receipts: receiptArr,
                    date: requestDate
                }
            }
        })
        console.log(data)
    }
    const onError = ({ errors, files }: any) => {
        console.log('Error', errors, files);
    };
    return <form>
        <GrantSelect state={grantID} setState={setGrantID} />
        <h4>Amount</h4>
        <input type="number" onChange={(e: any) => setAmount(parseFloat(e.target.value))} />
        <h4>Date</h4>
        <input type="date" name="date" onChange={(e: any) => setDate(new Date(e.target.value).toISOString())} />
        <h4>Description</h4>
        <textarea rows={5} name="description" value={description} onChange={handleDescription} />
        <span>{description.length}/75 characters</span>
        <h4>{receipts.length} Receipts</h4>
        <span className="description">Limit of 5 Receipts per Request</span>
        <ImageUploading
            multiple
            value={receipts}
            onChange={onChange}
            maxNumber={maxNumber}
            onError={onError}
            dataURLKey="data_url">
            {({ imageList,
                // onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
                errors
            }) => (
                <div className="upload-image-wrapper">
                    {/* <button onClick={onImageUpload} className='upload-btn'>
                        Click to Upload
                    </button>
                    <p>or</p> */}
                    {errors && (
                        <div className="error-container">
                            {errors.maxNumber && (
                                <span className='error-alert'>You've reached the image upload limit</span>
                            )}
                            {errors.acceptType && (
                                <span className='error-alert'>Your attempting to upload a forbidden file type</span>
                            )}
                            {errors.maxFileSize && (
                                <span className='error-alert'>Your file exceeds the max size</span>
                            )}
                            {errors.resolution && (
                                <span className='error-alert'>Your file is not the correct resolution</span>
                            )}
                        </div>
                    )}
                    <div
                        className="upload-area"
                        style={isDragging ? { background: 'lightsteelblue' } : undefined}
                        {...dragProps}>
                        <h1 className="description">Drop Images Here</h1>
                    </div>
                    <button onClick={onImageRemoveAll} className='remove-all-btn'>Remove All Receipts</button>

                    <div className="image-container">
                        {imageList.map((image, index) => <div key={index} className="image-item">
                            <img src={image['data_url']} alt="" width="200" height="200" />
                            <div className="image-item__btn-wrapper">
                                <button className='remove-single-img' onClick={() => onImageRemove(index)}>X</button>
                                <button className='swap-single-img' onClick={() => onImageUpdate(index)}>↔</button>
                            </div>
                        </div>
                        )}
                    </div>

                </div>
            )}
        </ImageUploading>
        <br />
        <button className='submit' onClick={submitRequest}>Submit Request</button>
    </form>
}