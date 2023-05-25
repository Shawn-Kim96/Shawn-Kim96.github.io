import os
import requests
import pandas as pd

github_token = "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"
gspread_url = "https://docs.google.com/spreadsheets/d/1sy3h8yh7KQRhJi_GblLiA4kmnXvVAKnTjagYLpwJFGo/edit#gid=1085981774"
google_key_path = 'google_service_account_key.json'

results = requests.get(
    "https://api.github.com/repos/shawn-kim96/shawn-kim96.github.io/issues?labels=rsvp&body",
    headers={
        'Authorization': github_token
        }
    ).json()

df = pd.read_csv("rsvp_result.csv")

def extract_info_from_issue(issue):
    assert type(issue) == dict
    assert issue['body'] is not None

    return issue['title'].split(" : ")[-1], [x.split(" : ")[-1].split('\r')[0] for x in issue['body'].split("\n")]


def append_to_result(input_data: list):
    rsvp_name, (rsvp_type, rsvp_num, rsvp_food, rsvp_bus) = input_data
    if not rsvp_num.isdigit():
        for r in rsvp_num:
            if r.isdigit():
                rsvp_num = int(r)
                break
    rsvp_num = int(rsvp_num)

    filtered_data = df.loc[df.name == rsvp_name]
    data_exist = filtered_data is not None and len(filtered_data)

    if data_exist:
        if not filtered_data.values[0].tolist() == [rsvp_name, rsvp_type, rsvp_num, rsvp_food, rsvp_bus]:
            df.drop(df[df.name==rsvp_name].index, inplace=True)
            df.reset_index(inplace=True, drop=True)
            df.loc[len(df)] = [rsvp_name, rsvp_type, rsvp_num, rsvp_food, rsvp_bus]
    
    else:
        df.loc[len(df)] = [rsvp_name, rsvp_type, rsvp_num, rsvp_food, rsvp_bus]


def analysis_rsvp_data():
    "return husband / wife   bus"
    husband_num = sum(df.loc[df.type == 'husband']['headcount'])
    wife_num = sum(df.loc[df.type == 'wife']['headcount'])
    nuclear_num = len(df.loc[df.bus == 'rsvp_bus_nuclear'])
    church_num = len(df.loc[df.bus == 'rsvp_bus_church'])
    cityhall_num = len(df.loc[df.bus == 'rsvp_bus_cityhall'])
    return husband_num, wife_num, nuclear_num, church_num, cityhall_num


def update_data_to_readme(husband_num, wife_num, nuclear_num, church_num, cityhall_num):
    total_headnum = husband_num + wife_num
    total_busnum = sum([nuclear_num, church_num, cityhall_num])
    
    headnum_info = f"""
|신랑측 인원|신부측 인원|총 인원|
|---|---|---|
|{husband_num:03d}|{wife_num:03d}|{total_headnum:03d}|
    """

    busnum_info = f"""
|원자력연구원|시청|인동교회|총 인원|
|---|---|---|---|
|{nuclear_num:02d}|{church_num:02d}|{cityhall_num:02d}|{total_busnum:03d}|
    """

    readme = f"""
# Shawn-Kim96.github.io\n
## 인원수 정보
### 총 참석 인원
{headnum_info}\n

### 버스 인원
{busnum_info}\n
    """
    
    with open(f"README.md", "w") as f:
        f.write(readme)
        f.close()


if __name__=="__main__":
    for res in results:
        api_data = extract_info_from_issue(res)
        append_to_result(api_data)
    df.to_csv("rsvp_result.csv", index=False)
    analysis_result = analysis_rsvp_data()
    update_data_to_readme(*analysis_result)
