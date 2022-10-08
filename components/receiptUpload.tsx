import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";
import Image from "next/image";
import { useState } from "react";
let imageState: ImageType[]
export default function ReceiptUpload({ receipts, setReceipts }: any) {
    const [imageList, setImageList] = useState(imageState)
    const onChange = (
        receiptList: ImageListType,
    ) => {
        const receiptArr: string[] = receiptList.map((receipt: any) => receipt.data_url)
        console.log(receiptList)
        setImageList(receiptList)
        setReceipts(receiptArr);
    };
    const onError = ({ errors, files }: any) => {
        console.log('Error', errors, files);
    };
    const maxNumber = 5;
    return <ImageUploading
        multiple
        value={imageList}
        onChange={onChange}
        maxNumber={maxNumber}
        onError={onError}
        acceptType={['png', 'jpg', 'pdf']}
        dataURLKey="data_url">
        {({ imageList,
            onImageRemoveAll,
            onImageRemove,
            onImageUpload,
            isDragging,
            dragProps,
            errors
        }) => (
            <div className="upload-image-wrapper">
                {errors && (
                    <div className="error-container">
                        {errors.maxNumber && (
                            <span className='error-alert'>{"You've reached the image upload limit"}</span>
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
                <br />
                <div
                    onClick={onImageUpload}
                    className="upload-area"
                    style={isDragging ? { background: 'cadetblue', opacity: '50%' } : undefined}
                    {...dragProps}>
                    <h2 className="description"><a className="upload-link">Click Here</a><br />or <br /> Drag and Drop <br />to Upload Receipts</h2>
                </div>
                <br />
                {imageList.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <button onClick={onImageRemoveAll} className='remove-all-btn'>Remove All Receipts</button>
                    <h3 style={{ textAlign: 'center' }}>{receipts.length} Attached Receipt{receipts.length === 0 && 's'}{receipts.length > 1 && "s"} </h3>
                </div>}
                <div className="image-container">
                    {imageList.map((image, index) => <div key={index} className="image-item">
                        <a onClick={() => onImageRemove(index)}><h1 className='remove' >X</h1>
                            <Image src={image['data_url'] || image} alt="" width="200" height="200" />
                        </a>
                    </div>
                    )}
                </div>

            </div>
        )}
    </ImageUploading>
}