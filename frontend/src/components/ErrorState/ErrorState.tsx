const ErrorState = ({ error }: { error: string }) => {
    return (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          />
        </div>
    )
}

export default ErrorState;