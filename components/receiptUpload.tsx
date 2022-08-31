import ImageUploading, { ImageListType } from "react-images-uploading";
import Image from "next/image";
export default function ReceiptUpload({ receipts, setReceipts }: any) {
    const onChange = (
        receiptList: ImageListType,
    ) => {
        const receiptArr: string[] = receiptList.map((receipt: any) => receipt.data_url)
        console.log(receiptList)
        setReceipts(receiptArr);
    };
    const onError = ({ errors, files }: any) => {
        console.log('Error', errors, files);
    };
    const maxNumber = 5;
    return <ImageUploading
        multiple
        value={receipts}
        onChange={onChange}
        maxNumber={maxNumber}
        onError={onError}
        acceptType={['png', 'jpg', 'pdf']}
        dataURLKey="data_url">
        {({ imageList,
            onImageRemoveAll,
            onImageRemove,
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
                <button onClick={onImageRemoveAll} className='remove-all-btn'>Remove All Receipts</button>
                <br />
                <br />
                <div
                    className="upload-area"
                    style={isDragging ? { background: 'lightsteelblue' } : undefined}
                    {...dragProps}>
                    <p className="description">Drop Receipt Images Here</p>
                </div>

                <div className="image-container">
                    {imageList.map((image, index) => <div key={index} className="image-item">
                        <a className='remove' onClick={() => onImageRemove(index)}><p>X</p></a>
                        <Image src={image['data_url'] || image} alt="" width="200" height="200" />
                    </div>
                    )}
                </div>

            </div>
        )}
    </ImageUploading>
}