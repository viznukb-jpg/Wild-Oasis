import { getCabin, getBookedDatesByCabinId } from "@/app/_lib/data-service";

export async function GET(request, { params }) {
  const { cabinId } = await params;

  try {
    console.log(getCabin, getBookedDatesByCabinId);
    const [cabin, bookedDates] = await Promise.all([
      getCabin(cabinId),
      getBookedDatesByCabinId(cabinId),
    ]);

    return Response.json({ cabinId, bookedDates });
  } catch {
    return Response.json({ message: "Cabin not found!" });
  }
}

export async function POST() {}

export async function UPDATE() {}

export async function DELETE() {}
