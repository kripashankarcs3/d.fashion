import EditorialContainer from '@/components/editorial/EditorialContainer';
import PageMasthead from '@/components/editorial/PageMasthead';
import { Emphasis } from '@/components/editorial/EditorialHeading';
import UploadFlow from '@/components/UploadFlow';

export default function Upload() {
  return (
    <section className="w-full min-h-[100svh] bg-surface-1 pt-28 pb-24">
      <EditorialContainer width="narrow">
        {/* Masthead */}
        <PageMasthead
          label="Upload"
          title={
            <>
              Upload your photo <Emphasis>to begin.</Emphasis>
            </>
          }
          lede="Secure. Private. Your original photo is deleted immediately after analysis; the enhanced copy is removed within two hours."
        />

        {/* UploadFlow — unchanged functionality */}
        <div className="mt-14">
          <UploadFlow />
        </div>
      </EditorialContainer>
    </section>
  );
}
