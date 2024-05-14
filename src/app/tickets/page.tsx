import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Heading } from "@/components/heading";
import { Placeholder } from "@/components/placeholder";
import { Spinner } from "@/components/spinner";
import { TicketList } from "@/features/ticket/components/ticket-list";

const TicketsPage = async () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <Heading title="Tickets" description="All your tickets at one place" />

      <Suspense fallback={<Spinner />}>
        <ErrorBoundary fallback={<Placeholder label="Something went wrong!" />}>
          <TicketList />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

export default TicketsPage;
