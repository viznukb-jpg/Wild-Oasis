"use server";

import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { getBookings } from "./data-service";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const data = Object.fromEntries(formData.entries());

  const { nationalID, nationality } = data;
  const [countryName, countryFlag] = nationality.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID!");

  const updateData = { nationality: countryName, countryFlag, nationalID };

  const { responseData, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsId = guestBookings.map((booking) => booking.id);

  if (!guestBookingsId.includes(bookingId))
    throw new Error("Booking could not be deleted");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservation(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  const reservationId = Number(formData.get("reservationId"));
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations").slice(0, 1000);

  if (!guestBookingsIds.includes(reservationId))
    throw new Error("You are not allowed to update this bookings");

  const updatedFields = { numGuests, observations };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", reservationId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  redirect("/account/reservations");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in!");

  const newReservation = {
    ...bookingData,
    guestID: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000) || "No",
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newReservation]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/thankyou");
}

export async function generateMockBookings() {
  const mockBookings = [];

  // Беремо сьогоднішню дату і додаємо 1 місяць
  let currentStartDate = new Date();
  currentStartDate.setMonth(currentStartDate.getMonth() + 1);

  // Генеруємо 5 бронювань (можете змінити кількість)
  for (let i = 0; i < 5; i++) {
    const startDate = new Date(currentStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 5); // Нехай кожне бронювання триває 5 ночей

    mockBookings.push({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      numNights: 5,
      numGuests: 2,
      cabinPrice: 2300,
      extrasPrice: 200,
      totalPrice: 2500,
      status: "unconfirmed", // Ставимо статус непідтвердженого
      hasBreakfast: true,
      isPaid: false,
      observations: `Згенероване тестове бронювання #${i + 1}`,
      cabinID: 3, // ID кабіни зі скріншота
      guestID: 2, // ID гостя (як ви просили)
    });

    // Наступне бронювання почнеться через 7 днів (щоб не перекривалися)
    currentStartDate.setDate(currentStartDate.getDate() + 7);
  }

  // Передаємо ВЕСЬ масив в insert
  const { error } = await supabase.from("bookings").insert(mockBookings);

  if (error) {
    console.error("Помилка генерації:", error);
    throw new Error("Не вдалося згенерувати бронювання");
  }

  // Оновлюємо кеш сторінки, щоб одразу побачити зміни
  revalidatePath("/account/reservations");
}
