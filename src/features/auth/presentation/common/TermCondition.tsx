export default function TermCondition({
  isOpenTermCondition,
  setOpenTermCondition,
}: {
  isOpenTermCondition: boolean;
  setOpenTermCondition: (isOpenTermCondition: boolean) => void;
}) {
  return (
    <>
      <div className="flex items-center mt-3">
        <input type="checkbox" id="terms" required className="mt-1 mr-2" />
        <label htmlFor="terms" className="text-pretty text-xs text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </a>
          .
        </label>
      </div>
    </>
  );
}
