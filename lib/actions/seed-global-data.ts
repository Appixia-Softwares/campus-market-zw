"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function seedCountries() {
  const supabase = createServerClient()

  const countries = [
    { name: "United States", code: "US" },
    { name: "United Kingdom", code: "GB" },
    { name: "Canada", code: "CA" },
    { name: "Australia", code: "AU" },
    { name: "Germany", code: "DE" },
    { name: "France", code: "FR" },
    { name: "Japan", code: "JP" },
    { name: "China", code: "CN" },
    { name: "India", code: "IN" },
    { name: "Brazil", code: "BR" },
    { name: "South Africa", code: "ZA" },
    { name: "Nigeria", code: "NG" },
    { name: "Kenya", code: "KE" },
    { name: "Zimbabwe", code: "ZW" },
    { name: "Ghana", code: "GH" },
  ]

  for (const country of countries) {
    const { error } = await supabase
      .from("countries")
      .upsert({ name: country.name, code: country.code }, { onConflict: "code" })

    if (error) {
      console.error(`Error seeding country ${country.name}:`, error)
    }
  }

  return { success: true, message: "Countries seeded successfully" }
}

export async function seedCities() {
  const supabase = createServerClient()

  // Get country IDs
  const { data: countries, error: countriesError } = await supabase.from("countries").select("id, code")

  if (countriesError || !countries) {
    return { error: "Failed to fetch countries" }
  }

  // Create a map of country codes to IDs
  const countryMap = countries.reduce((acc, country) => {
    acc[country.code] = country.id
    return acc
  }, {})

  const cities = [
    // US cities
    { name: "New York", countryCode: "US" },
    { name: "Los Angeles", countryCode: "US" },
    { name: "Chicago", countryCode: "US" },
    { name: "Boston", countryCode: "US" },

    // UK cities
    { name: "London", countryCode: "GB" },
    { name: "Manchester", countryCode: "GB" },
    { name: "Edinburgh", countryCode: "GB" },
    { name: "Oxford", countryCode: "GB" },

    // Canadian cities
    { name: "Toronto", countryCode: "CA" },
    { name: "Vancouver", countryCode: "CA" },
    { name: "Montreal", countryCode: "CA" },

    // Australian cities
    { name: "Sydney", countryCode: "AU" },
    { name: "Melbourne", countryCode: "AU" },

    // Zimbabwe cities
    { name: "Harare", countryCode: "ZW" },
    { name: "Bulawayo", countryCode: "ZW" },
    { name: "Gweru", countryCode: "ZW" },
    { name: "Mutare", countryCode: "ZW" },

    // South African cities
    { name: "Johannesburg", countryCode: "ZA" },
    { name: "Cape Town", countryCode: "ZA" },
    { name: "Durban", countryCode: "ZA" },

    // Nigerian cities
    { name: "Lagos", countryCode: "NG" },
    { name: "Abuja", countryCode: "NG" },

    // Kenyan cities
    { name: "Nairobi", countryCode: "KE" },
    { name: "Mombasa", countryCode: "KE" },
  ]

  for (const city of cities) {
    const countryId = countryMap[city.countryCode]

    if (!countryId) {
      console.error(`Country code ${city.countryCode} not found`)
      continue
    }

    const { error } = await supabase
      .from("cities")
      .upsert({ name: city.name, country_id: countryId }, { onConflict: "name, country_id" })

    if (error) {
      console.error(`Error seeding city ${city.name}:`, error)
    }
  }

  return { success: true, message: "Cities seeded successfully" }
}

export async function seedUniversities() {
  const supabase = createServerClient()

  // Get countries and cities
  const { data: countries, error: countriesError } = await supabase.from("countries").select("id, code")

  if (countriesError || !countries) {
    return { error: "Failed to fetch countries" }
  }

  const { data: cities, error: citiesError } = await supabase.from("cities").select("id, name, country_id")

  if (citiesError || !cities) {
    return { error: "Failed to fetch cities" }
  }

  // Create maps for lookup
  const countryMap = countries.reduce((acc, country) => {
    acc[country.code] = country.id
    return acc
  }, {})

  const cityMap = {}
  cities.forEach((city) => {
    if (!cityMap[city.country_id]) {
      cityMap[city.country_id] = {}
    }
    cityMap[city.country_id][city.name] = city.id
  })

  const universities = [
    // US universities
    {
      name: "Harvard University",
      cityName: "Boston",
      countryCode: "US",
      website: "https://www.harvard.edu",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png",
    },
    {
      name: "MIT",
      cityName: "Boston",
      countryCode: "US",
      website: "https://www.mit.edu",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png",
    },
    {
      name: "Stanford University",
      cityName: "Los Angeles",
      countryCode: "US",
      website: "https://www.stanford.edu",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_Cardinal_logo.svg/1200px-Stanford_Cardinal_logo.svg.png",
    },
    {
      name: "Columbia University",
      cityName: "New York",
      countryCode: "US",
      website: "https://www.columbia.edu",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Columbia_University_shield.svg/1200px-Columbia_University_shield.svg.png",
    },

    // UK universities
    {
      name: "University of Oxford",
      cityName: "Oxford",
      countryCode: "GB",
      website: "https://www.ox.ac.uk",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/1200px-Oxford-University-Circlet.svg.png",
    },
    {
      name: "University of Cambridge",
      cityName: "London",
      countryCode: "GB",
      website: "https://www.cam.ac.uk",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/University_of_Cambridge_coat_of_arms.svg/1200px-University_of_Cambridge_coat_of_arms.svg.png",
    },
    {
      name: "Imperial College London",
      cityName: "London",
      countryCode: "GB",
      website: "https://www.imperial.ac.uk",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Imperial_College_London_crest.svg/1200px-Imperial_College_London_crest.svg.png",
    },

    // Zimbabwe universities
    {
      name: "University of Zimbabwe",
      cityName: "Harare",
      countryCode: "ZW",
      website: "https://www.uz.ac.zw",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/University_of_Zimbabwe.svg/1200px-University_of_Zimbabwe.svg.png",
    },
    {
      name: "National University of Science and Technology",
      cityName: "Bulawayo",
      countryCode: "ZW",
      website: "https://www.nust.ac.zw",
      logo_url: "https://www.nust.ac.zw/images/logo.png",
    },
    {
      name: "Midlands State University",
      cityName: "Gweru",
      countryCode: "ZW",
      website: "https://www.msu.ac.zw",
      logo_url: "https://www.msu.ac.zw/wp-content/uploads/2019/11/MSU-Logo.png",
    },
    {
      name: "Harare Institute of Technology",
      cityName: "Harare",
      countryCode: "ZW",
      website: "https://www.hit.ac.zw",
      logo_url: "https://www.hit.ac.zw/images/logo.png",
    },

    // South African universities
    {
      name: "University of Cape Town",
      cityName: "Cape Town",
      countryCode: "ZA",
      website: "https://www.uct.ac.za",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/University_of_Cape_Town_logo.svg/1200px-University_of_Cape_Town_logo.svg.png",
    },
    {
      name: "University of the Witwatersrand",
      cityName: "Johannesburg",
      countryCode: "ZA",
      website: "https://www.wits.ac.za",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/University_of_the_Witwatersrand_logo.svg/1200px-University_of_the_Witwatersrand_logo.svg.png",
    },
  ]

  for (const university of universities) {
    const countryId = countryMap[university.countryCode]

    if (!countryId) {
      console.error(`Country code ${university.countryCode} not found`)
      continue
    }

    const cityId = cityMap[countryId]?.[university.cityName]

    if (!cityId) {
      console.error(`City ${university.cityName} not found in country ${university.countryCode}`)
      continue
    }

    const { error } = await supabase.from("universities").upsert(
      {
        name: university.name,
        city_id: cityId,
        country_id: countryId,
        website: university.website,
        logo_url: university.logo_url,
        is_verified: true,
      },
      { onConflict: "name, country_id" },
    )

    if (error) {
      console.error(`Error seeding university ${university.name}:`, error)
    }
  }

  return { success: true, message: "Universities seeded successfully" }
}

export async function seedCurrencies() {
  const supabase = createServerClient()

  const currencies = [
    { name: "US Dollar", code: "USD", symbol: "$" },
    { name: "Euro", code: "EUR", symbol: "€" },
    { name: "British Pound", code: "GBP", symbol: "£" },
    { name: "Japanese Yen", code: "JPY", symbol: "¥" },
    { name: "Canadian Dollar", code: "CAD", symbol: "C$" },
    { name: "Australian Dollar", code: "AUD", symbol: "A$" },
    { name: "Swiss Franc", code: "CHF", symbol: "Fr" },
    { name: "Chinese Yuan", code: "CNY", symbol: "¥" },
    { name: "Indian Rupee", code: "INR", symbol: "₹" },
    { name: "South African Rand", code: "ZAR", symbol: "R" },
    { name: "Nigerian Naira", code: "NGN", symbol: "₦" },
    { name: "Kenyan Shilling", code: "KES", symbol: "KSh" },
    { name: "Zimbabwean Dollar", code: "ZWL", symbol: "Z$" },
  ]

  for (const currency of currencies) {
    const { error } = await supabase
      .from("currencies")
      .upsert({ name: currency.name, code: currency.code, symbol: currency.symbol }, { onConflict: "code" })

    if (error) {
      console.error(`Error seeding currency ${currency.name}:`, error)
    }
  }

  return { success: true, message: "Currencies seeded successfully" }
}

export async function seedLanguages() {
  const supabase = createServerClient()

  const languages = [
    { name: "English", code: "en" },
    { name: "Spanish", code: "es" },
    { name: "French", code: "fr" },
    { name: "German", code: "de" },
    { name: "Chinese", code: "zh" },
    { name: "Japanese", code: "ja" },
    { name: "Arabic", code: "ar" },
    { name: "Russian", code: "ru" },
    { name: "Portuguese", code: "pt" },
    { name: "Hindi", code: "hi" },
    { name: "Swahili", code: "sw" },
    { name: "Yoruba", code: "yo" },
    { name: "Zulu", code: "zu" },
    { name: "Shona", code: "sn" },
    { name: "Ndebele", code: "nd" },
  ]

  for (const language of languages) {
    const { error } = await supabase
      .from("languages")
      .upsert({ name: language.name, code: language.code }, { onConflict: "code" })

    if (error) {
      console.error(`Error seeding language ${language.name}:`, error)
    }
  }

  return { success: true, message: "Languages seeded successfully" }
}

export async function seedAllGlobalData() {
  const countriesResult = await seedCountries()
  const citiesResult = await seedCities()
  const universitiesResult = await seedUniversities()
  const currenciesResult = await seedCurrencies()
  const languagesResult = await seedLanguages()

  return {
    success: true,
    countries: countriesResult,
    cities: citiesResult,
    universities: universitiesResult,
    currencies: currenciesResult,
    languages: languagesResult,
  }
}
