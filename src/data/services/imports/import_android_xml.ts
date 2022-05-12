import Project from "@/data/models/api/Project";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import {ImportItem} from "@/data/models/types/import";
import Value, {ValueQuantity} from "@/data/models/api/Value";

export const jsonTranslationFromXML = async function(project: Project , item: ImportItem): Promise<Project> {
  const reader = new FileReader()
  reader.readAsText(item.content)

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const xmlString: string = result.target.result.toString()
      xmlString.split("\n").forEach((line) => {
        if (line.includes("<!--")) {
          const group = line.split("<!--")[1].split("-->")[0]

          project.groups.push(Group.empty(group))
        }
      })

      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlString, "text/xml")

      const plurals = xmlDoc.getElementsByTagName("plural")
      const singular = xmlDoc.getElementsByTagName("string")

      console.log(plurals)
      console.log(singular)

      for (let i = 0; i < singular.length; i++) {
        const keyXml = singular[i].getAttribute("name")
        const valueXml = singular[i].innerHTML

        const group = project.groups.filter(group => keyXml.includes(group.name)).reduce((a, b) => a.name.length > b.name.length ? a : b)
        const key = Key.map({name: keyXml.replace(group.name + "_", ""), isPlural: false})
        const value = Value.map({name: valueXml, languageName: item.language})

        key.values.push(value)
        group.keys.push(key)
      }

      for (let i = 0; i < plurals.length; i++) {
        const keyXml = plurals[i].getAttribute("name")
        const values = plurals[i].getElementsByTagName("item")

        const group = project.groups.filter(group => keyXml.includes(group.name)).reduce((a, b) => a.name.length > b.name.length ? a : b)
        const key = Key.map({name: keyXml.replace(group.name + "_", ""), isPlural: true})

        for (let j = 0; j < values.length; j++) {
          const quantity = values[j].getAttribute("quantity")
          const valueXml = values[j].innerHTML
          const value = Value.map({name: valueXml, quantityString: ValueQuantity[quantity], languageName: item.language})

          key.values.push(value)
        }

        group.keys.push(key)
      }

      resolve(project)
    }
  })
}
