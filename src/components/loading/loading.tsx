import './loading.scss';

export const Loading = () => {
    return (
        <>
            <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
            </div>
            <div className='z-3 BackgroundLoading'></div>
        </>
    )
}